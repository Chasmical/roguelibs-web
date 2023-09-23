import { DocPageProps, fetchFile } from "@components/DocPage";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import yaml from "js-yaml";

export interface DocSidebarProps {
  sidebar: DocSidebarSection[];
}
export default async function DocSidebar(props: Omit<DocPageProps, "path">) {
  const sidebar = await fetchDocSidebar(props);

  return (
    <div className={styles.sidebar}>
      {sidebar.map(s => (
        <DocSidebarSection section={s} key={s.name} />
      ))}
    </div>
  );
}

export interface DocSidebarSectionProps {
  section: DocSidebarSection;
}
export function DocSidebarSection({ section }: DocSidebarSectionProps) {
  return (
    <div>
      <div>{section.name}</div>
      <ul>
        {section.children.map(p => (
          <li key={p.name}>{p.children ? <DocSidebarCategory category={p} /> : <DocSidebarItem item={p} />}</li>
        ))}
      </ul>
    </div>
  );
}

export interface DocSidebarCategoryProps {
  category: DocSidebarCategory;
}
export function DocSidebarCategory({ category }: DocSidebarCategoryProps) {
  return (
    <div>
      <div>{category.name}</div>
      <ul>
        {category.children.map(p => (
          <li key={p.name}>{p.children ? <DocSidebarCategory category={p} /> : <DocSidebarItem item={p} />}</li>
        ))}
      </ul>
    </div>
  );
}

export interface DocSidebarItemProps {
  item: DocSidebarItem;
}
export function DocSidebarItem({ item }: DocSidebarItemProps) {
  return <Link href={"/" + item.path}>{item.name}</Link>;
}

export async function fetchDocSidebar({ repo, branch, sidebar, serveLocal }: Omit<DocPageProps, "path">) {
  const source = await fetchFile({ repo, branch, path: `docs/${sidebar}.yml`, serveLocal });
  const sections = yaml.loadAll(source) as Section[];
  return sections.map(s => parseDocSection(s, "docs"));
}

function parseDocSection(section: Section, basePath: string): DocSidebarSection {
  return {
    name: "" + section.section,
    children: parseDocItems(section.pages, basePath),
  };
}
function parseDocItems(items: Section["pages"], basePath: string): DocSidebarSection["children"] {
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

interface Section {
  section: string | null;
  pages: (Categories | string)[] | null;
}
interface Categories {
  [categoryName: string]: (Categories | string)[] | null;
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
