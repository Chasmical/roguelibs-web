import { compileMDX } from "@lib/mdx";
import { readFile } from "fs/promises";
import yaml from "js-yaml";
import DocSidebar from "@components/DocPage/Sidebar";
import styles from "./index.module.scss";
import clsx from "clsx";
import "katex/dist/katex.min.css";

export interface DocPageProps extends FileFetchInfo {
  sidebar: string;
}

export default async function DocPage(props: DocPageProps) {
  const source = await fetchFile(props);

  const { content } = await compileMDX<Frontmatter>(source, { format: "mdx" });

  return (
    <div className={styles.wrapper}>
      <DocSidebar {...props} />
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

export interface FileFetchInfo {
  repo: string;
  branch?: string;
  path: string;
  serveLocal?: string | null;
}

export async function fetchFile({ repo, branch, path, serveLocal }: FileFetchInfo) {
  if (process.env.NODE_ENV === "development" && serveLocal) {
    const content = await readFile(`${serveLocal}/${path}`, "utf8");
    return content.toString();
  }
  const url = `https://raw.githubusercontent.com/${repo}/${branch ?? "main"}/${path}`;
  const res = await fetch(url, { next: { tags: ["docs"] } });
  return await res.text();
}

export function extractFrontmatter(source: string) {
  const frontmatterEnd = Math.max(source.indexOf("\n---", 1), 0);
  return yaml.load(source.slice(0, frontmatterEnd)) as Frontmatter;
}
