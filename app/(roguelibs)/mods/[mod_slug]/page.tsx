import ModPage from "@components/ModPage";
import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { Metadata } from "next";
import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: { mod_slug: string };
}

export default async function ModPageIndex({ params }: PageProps) {
  const api = createServerApi({ headers, cookies });

  const mod = await api.fetchModWithReleasesBySlug(params.mod_slug);
  if (!mod) {
    return <div>{`Oops, looks like a mod with a URL slug "${params.mod_slug}" could not be found`}</div>;
  }

  return (
    <>
      <ModPage key={mod.id} mod={mod} releases={mod.releases} />
      <SetCanonicalUrl url={`/mods/${mod.slug ?? mod.id}`} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const api = createServerApi({ headers, cookies });
  const mod = await api.fetchModWithReleasesBySlug(params.mod_slug);
  if (!mod) notFound();

  return {
    title: mod.title,
    description: mod.description,
    authors: mod.authors.map(a => ({ name: a.user.username, url: `/users/${a.user.slug ?? a.user.id}` })),
    openGraph: {
      type: "article",
      title: mod.title,
      description: mod.description,
      url: `/mods/${mod.slug ?? mod.id}`,
      authors: mod.authors.map(a => a.user.username),
      publishedTime: mod.created_at,
      modifiedTime: mod.edited_at ?? undefined,
      locale: "en",
      siteName: "RogueLibs Web",
      section: "Mods",
      tags: ["streets of rogue", "mod"],
    },
    twitter: {
      card: "summary_large_image",
      title: mod.title,
      description: mod.description,
      images: [mod.banner_url ?? "/placeholder.png"],
    },
  };
}
