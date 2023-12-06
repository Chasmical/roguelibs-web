import ModPage from "@components/ModPage";
import ModPageSkeleton from "@components/ModPage/skeleton";
import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { Metadata } from "next";
import { createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";

interface PageProps {
  params: { mod_slug: string };
}

export default async function ModPageIndex({ params }: PageProps) {
  if (params.mod_slug === "never") return <ModPageSkeleton />;

  const api = createServerApi({ headers, cookies });

  const mod = await api.fetchModWithReleasesBySlug(params.mod_slug);
  if (!mod) {
    return <div>{`Oops, looks like a mod with a URL slug "${params.mod_slug}" could not be found`}</div>;
  }

  const { content } = await compileMdx(mod.description, {
    ...configurePlugins({ gitHubRepo: mod.github_repo }),
    components: configureComponents(),
  });

  const releases = mod.releases;
  delete (mod as any).releases;

  const releaseContents = await Promise.all(
    releases.map(async r => {
      const { content } = await compileMdx(r.changelog, {
        ...configurePlugins({ gitHubRepo: mod.github_repo }),
        components: configureComponents(),
      });
      return content;
    }),
  );

  return (
    <>
      <ModPage mod={mod} releases={releases} rscDescription={content} rscChangelogs={releaseContents} />
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
    description: mod.card_description ?? mod.description,
    authors: mod.authors.map(a => ({ name: a.user.username, url: `/user/${a.user.slug ?? a.user.id}` })),
    openGraph: {
      type: "article",
      title: mod.title,
      description: mod.card_description ?? mod.description,
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
      description: mod.card_description ?? mod.description,
      images: [mod.card_banner_url ?? mod.banner_url ?? "/placeholder.png"],
    },
  };
}
