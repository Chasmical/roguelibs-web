import { DocSidebarCategory, DocSidebarItem, DocSidebarSection } from "@components/DocPage";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";

export interface DocSidebarProps {
  sidebar: DocSidebarSection[];
}
export default function DocSidebar({ sidebar }: DocSidebarProps) {
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
