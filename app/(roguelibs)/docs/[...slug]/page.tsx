import { Metadata } from "next";
import { notFound } from "next/navigation";
import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import DocPage, { DocPageProps, Frontmatter, fetchFile } from "@components/DocPage";
import { findDirectoryWithTarget } from "@lib/utils/file";
import yaml from "js-yaml";

interface PageProps {
  params: { slug: string[] };
}

export default async function DocPageIndex({ params }: PageProps) {
  const [path, url] = resolveSlug(params.slug);
  return (
    <>
      <DocPage {...props} path={path} />
      <SetCanonicalUrl url={url} />
    </>
  );
}

const props: Omit<DocPageProps, "path"> = {
  repo: "SugarBarrel/RogueLibs",
  branch: "v4-beta",
  sidebar: "dev-docs",
  serveLocal: findDirectoryWithTarget(__dirname, "RogueLibs/RogueLibs.sln") + "/RogueLibs",
};

function resolveSlug(slug: string[]): [path: string, url: string] {
  const path = slug.join("/");
  return [`docs/${path}.mdx`, `/docs/${path}`];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [path, url] = resolveSlug(params.slug);
  const source = await fetchFile({ ...props, path });

  const frontmatterEnd = Math.max(source.indexOf("\n---", 1), 0);
  const frontmatter = yaml.load(source.slice(0, frontmatterEnd)) as Frontmatter;
  if (!frontmatter) notFound();

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: "Roguelings Team", url: "/users/RoguelingsTeam" }],
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: url,
      authors: ["Roguelings Team"],
      // publishedTime: mod.created_at,
      // modifiedTime: mod.edited_at ?? undefined,
      locale: "en",
      siteName: "RogueLibs Web",
      section: "Documentation",
      tags: ["streets of rogue", "docs", "documentation"],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.image ?? "/logo.png"],
    },
  };
}
