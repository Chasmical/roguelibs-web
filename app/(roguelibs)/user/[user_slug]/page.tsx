import UserPage from "@components/UserPage";
import UserPageSkeleton from "@components/UserPage/skeleton";
import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { Metadata } from "next";
import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import { selectUniqueAvatar } from "@components/Common/Avatar";
import { compileMDX } from "@lib/mdx";

interface PageProps {
  params: { user_slug: string };
}

export default async function UserPageIndex({ params }: PageProps) {
  if (params.user_slug === "never") return <UserPageSkeleton />;

  const api = createServerApi({ headers, cookies });

  const user = await api.fetchUserBySlug(params.user_slug);
  if (!user) {
    return <div>{`Oops, looks like user with a URL slug "${params.user_slug}" could not be found`}</div>;
  }

  const { content } = await compileMDX(user.description);

  return (
    <>
      <UserPage user={user} rscDescription={content} />
      <SetCanonicalUrl url={`/user/${user.slug ?? user.id}`} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const api = createServerApi({ headers, cookies });
  const user = await api.fetchUserBySlug(params.user_slug);
  if (!user) notFound();

  return {
    title: user.username,
    description: "", // user.description,
    authors: [{ url: `/user/${user.slug ?? user.id}`, name: user.username }],
    openGraph: {
      type: "profile",
      username: user.username,
      title: user.username,
      description: "", // user.description,
      url: `/user/${user.slug ?? user.id}`,
      locale: "en",
      siteName: "RogueLibs Web",
    },
    twitter: {
      card: "summary",
      title: user.username,
      description: "", // user.description,
      images: [user.avatar_url ?? selectUniqueAvatar(user.id)],
    },
  };
}
