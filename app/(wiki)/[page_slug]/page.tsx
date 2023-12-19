import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { RogueLibsApi, createServerApi } from "@lib/API";
import { headers, cookies } from "next/headers";
import WikiPage from "@components/WikiPage";
import { notFound } from "next/navigation";
import { DbWikiPage, DbWikiPageRevision, DbWikiPageSlug } from "@lib/Database";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";
import { Metadata } from "next";

async function fetchPage(api: RogueLibsApi, slug: string) {
  slug = slug.replace(/%20/g, " ").trim().replace(/\s/g, "_");

  const res = await api.Supabase.from("wiki_page_slugs")
    .select(`*,page:wiki_pages(*,slugs:wiki_page_slugs(*),revisions:wiki_page_revisions(*))`)
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  const page = res.data?.page as
    | (DbWikiPage & { slugs: DbWikiPageSlug[]; revisions: DbWikiPageRevision[] })
    | undefined;

  page?.revisions.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  return page;
}

interface PageProps {
  params: { page_slug: string };
}
export default async function WikiPageIndex({ params: { page_slug } }: PageProps) {
  const api = createServerApi({ headers, cookies }, { revalidate: 300 });

  const page = await fetchPage(api, page_slug);
  if (!page) notFound();

  const revision = page.revisions[0];

  const rsc = await compileMdx(revision.content, {
    ...configurePlugins(),
    components: configureComponents(),
  });

  const slug = page.slugs.find(s => s.is_primary)?.slug;

  return (
    <>
      <WikiPage page={page} rscRevision={rsc.content} />
      <SetCanonicalUrl url={`/${slug}`} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const api = createServerApi({ headers, cookies });
  const page = await fetchPage(api, params.page_slug);
  if (!page) notFound();

  const revision = page.revisions[0];

  return {
    title: revision.title,
    // description: revision.card_description ?? revision.description,
    // authors: revision.authors.map(a => ({ name: a.user.username, url: `/user/${a.user.slug ?? a.user.id}` })),
    openGraph: {
      type: "article",
      title: revision.title,
      // description: revision.card_description ?? revision.description,
      url: `/${page.slugs[0].slug}`,
      // authors: revision.authors.map(a => a.user.username),
      publishedTime: revision.created_at,
      // modifiedTime: revision.edited_at ?? undefined,
      locale: "en",
      siteName: "SoR Wiki",
      section: "Wiki",
      tags: ["streets of rogue", "wiki"],
    },
    twitter: {
      card: "summary_large_image",
      title: revision.title,
      // description: revision.card_description ?? revision.description,
      // images: [revision.card_banner_url ?? revision.banner_url ?? "/placeholder.png"],
    },
  };
}
