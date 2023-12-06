import { readFile } from "fs/promises";
import DocSidebar from "@components/DocPage/Sidebar";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";
import styles from "./index.module.scss";
import clsx from "clsx";
import "katex/dist/katex.min.css";

export interface DocPageProps extends FileFetchInfo {
  sidebar: string;
}

export default async function DocPage(props: DocPageProps) {
  const source = await fetchFile(props);

  const { content } = await compileMdx<Frontmatter>(source, {
    format: "mdx",
    ...configurePlugins(),
    components: configureComponents(),
  });

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
