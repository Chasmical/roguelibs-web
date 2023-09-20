import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMDX } from "@lib/mdx";
import "katex/dist/katex.min.css";
import { Metadata } from "next";
import yaml from "js-yaml";
import { notFound } from "next/navigation";
import fs from "fs";
import Path from "path";
import { readFile } from "fs/promises";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import clsx from "clsx";

interface PageProps {
  params: { slug: string[] };
}

interface Frontmatter {
  title: string;
  description: string;
  image?: string;
}

export default async function DocsPageIndex({ params }: PageProps) {
  const sections = await fetchDocSections("SugarBarrel/RogueLibs", "v4-beta", "dev-docs");
  const source = await fetchDoc("SugarBarrel/RogueLibs", "v4-beta", params.slug);

  const { content } = await compileMDX<Frontmatter>(source);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        {sections.map(section => (
          <div key={section.name}>
            <div>{section.name}</div>
            <ul>
              {section.pages.map(p => (
                <li key={p.name}>{p.children ? <SidebarCategory category={p} /> : <SidebarItem page={p} />}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.main}>
        <div className={clsx(styles.central, "markdown")}>
          {content}
          <SetCanonicalUrl url={`/docs/${params.slug.join("/")}`} />
        </div>
      </div>
    </div>
  );
}

function SidebarCategory({ category, url }: { category: DocCategory; url?: string }) {
  url = (url ?? "/docs") + "/" + category.name;
  return (
    <div>
      <div>{category.name}</div>
      <ul>
        {category.children.map((p, i) => (
          <li key={i}>
            {p.children ? <SidebarCategory category={p} url={url} /> : <SidebarItem page={p} url={url} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
function SidebarItem({ page, url }: { page: DocPage; url?: string }) {
  return (
    <Link href={(url ?? "/docs") + "/" + page.name} prefetch={false}>
      {page.name}
    </Link>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const source = await fetchDoc("SugarBarrel/RogueLibs", "v4-beta", params.slug);

  const frontmatterEnd = Math.max(source.indexOf("\n---", 1), 0);
  const frontmatter = yaml.load(source.slice(0, frontmatterEnd)) as Frontmatter;
  if (!frontmatter) notFound();

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: "Abbysssal", url: "/users/Abbysssal" }],
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: `/docs/${params.slug.join("/")}`,
      authors: ["Abbysssal"],
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

async function fetchDocSections(repo: string, branch: string, path: string) {
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/docs/${path}.yml`);
  const sections = yaml.loadAll(await res.text()) as ConfigSection[];
  return sections.map(parseDocSection);
}
async function fetchDoc(repo: string, branch: string, path: string | string[]) {
  if (Array.isArray(path)) path = path.join("/");
  if (process.env.NODE_ENV === "development" && SERVE_LOCAL_DOCS && ROGUELIBS_DOCS_DIR) {
    const content = await readFile(`${ROGUELIBS_DOCS_DIR}\\${path}.mdx`);
    return content.toString();
  }
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/docs/${path}.mdx`);
  return await res.text();
}

const SERVE_LOCAL_DOCS = true;

const ROGUELIBS_DOCS_DIR = (() => {
  const parts = Path.normalize(__dirname).split(Path.sep);
  while (parts.length) {
    const path = parts.join(Path.sep) + Path.sep + "RogueLibs" + Path.sep + "docs";
    if (fs.existsSync(path)) return path;
    parts.pop();
  }
  return null;
})();

interface ConfigSection {
  section: string | null;
  pages: (ConfigCategories | string)[] | null;
}
interface ConfigCategories {
  [categoryName: string]: (ConfigCategories | string)[] | null;
}

interface DocSection {
  name: string;
  pages: (DocCategory | DocPage)[];
}
interface DocCategory {
  name: string;
  children: (DocCategory | DocPage)[];
}
interface DocPage {
  name: string;
  children?: never;
}

function parseDocSection(section: ConfigSection): DocSection {
  return {
    name: "" + section.section,
    pages: parseDocItems(section.pages),
  };
}
function parseDocItems(items: (ConfigCategories | string)[] | null): (DocCategory | DocPage)[] {
  if (items == null) return [];
  const pages: (DocCategory | DocPage)[] = [];

  for (const item of items) {
    if (item == null) continue;
    if (typeof item === "object") {
      pages.push(...Object.entries(item).map(([key, value]) => ({ name: "" + key, children: parseDocItems(value) })));
    } else {
      pages.push({ name: "" + item });
    }
  }

  return pages;
}
