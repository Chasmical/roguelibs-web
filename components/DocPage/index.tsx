import { compileMDX } from "@lib/mdx";
import { readFile } from "fs/promises";
import styles from "./index.module.scss";
import clsx from "clsx";
import yaml from "js-yaml";
import "katex/dist/katex.min.css";
import DocSidebar from "@components/DocPage/Sidebar";

export interface DocPageProps extends FileFetchInfo {
  sidebar: string;
}

export default async function DocPage(props: DocPageProps) {
  const sidebar = await fetchDocSidebar(props);
  const source = await fetchFile(props);

  const { content } = await compileMDX<Frontmatter>(source);

  return (
    <div className={styles.wrapper}>
      <DocSidebar sidebar={sidebar} />
      <div className={styles.main}>
        <div className={clsx(styles.central, "markdown")}>{content}</div>
      </div>
    </div>
  );
}

export interface Frontmatter {
  title: string;
  description: string;
  image?: string;
}

export async function fetchDocSidebar({ repo, branch, sidebar, serveLocal }: Omit<DocPageProps, "path">) {
  const source = await fetchFile({ repo, branch, path: `docs/${sidebar}.yml`, serveLocal });
  const sections = yaml.loadAll(source) as ConfigSidebarSection[];
  return sections.map(s => parseDocSection(s, "docs"));
}

export interface FileFetchInfo {
  repo: string;
  branch?: string;
  path: string;
  serveLocal?: string | null;
}
export async function fetchFile({ repo, branch, path, serveLocal }: FileFetchInfo) {
  if (process.env.NODE_ENV === "development" && serveLocal) {
    const content = await readFile(`${serveLocal}\\${path}`);
    return content.toString();
  }
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch ?? "main"}/${path}`);
  return await res.text();
}

function parseDocSection(section: ConfigSidebarSection, basePath: string): DocSidebarSection {
  return {
    name: "" + section.section,
    children: parseDocItems(section.pages, basePath),
  };
}
function parseDocItems(items: ConfigSidebarSection["pages"], basePath: string): DocSidebarSection["children"] {
  if (items == null) return [];
  const pages: (DocSidebarCategory | DocSidebarItem)[] = [];

  for (const item of items) {
    if (item == null) continue;
    if (typeof item === "object") {
      pages.push(
        ...Object.entries(item).map(([key, value]) => ({
          name: "" + key,
          path: basePath + "/" + key,
          children: parseDocItems(value, basePath + "/" + key),
        })),
      );
    } else {
      pages.push({ name: "" + item, path: basePath + "/" + item });
    }
  }

  return pages;
}

interface ConfigSidebarSection {
  section: string | null;
  pages: (ConfigSidebarCategories | string)[] | null;
}
interface ConfigSidebarCategories {
  [categoryName: string]: (ConfigSidebarCategories | string)[] | null;
}

export interface DocSidebarSection {
  name: string;
  children: (DocSidebarCategory | DocSidebarItem)[];
}
export interface DocSidebarCategory {
  name: string;
  path: string;
  children: (DocSidebarCategory | DocSidebarItem)[];
}
export interface DocSidebarItem {
  name: string;
  path: string;
  children?: never;
}
