import { useModPage } from "@components/ModPage";
import styles from "./Breadcrumbs.module.scss";
import Link from "@components/Common/Link";

export default function ModPageBreadcrumbs() {
  const { mod, original, isEditing } = useModPage();
  const modLink = `/mods/${original.slug}`;

  return (
    <div className={styles.breadcrumbs}>
      {">"}
      <span className={styles.breadcrumb}>
        <Link href="/mods">{"Mods"}</Link>
      </span>
      {">"}
      <span className={styles.breadcrumb}>
        <Link href={modLink} blank={isEditing}>
          {mod.title}
        </Link>
      </span>
    </div>
  );
}
