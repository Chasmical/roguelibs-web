"use client";
import { ModPageContext } from "@components/ModPage";
import styles from "./Breadcrumbs.module.scss";
import Link from "@components/Common/Link";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { useApi } from "@lib/API.Hooks";

export default function ModPageBreadcrumbs({ mod, original, mode, setMode }: ModPageContext) {
  const me = useApi().currentUser;
  const canEdit = original.authors.some(a => a.user_id === me?.id) || me?.is_admin;

  // TODO: move the crumbs up, split the editing controls into a separate component/file

  return (
    <div className={styles.breadcrumbs}>
      <div className={styles.breadcrumb}>
        <Link href="/" blank={!!mode}>
          {"RL"}
        </Link>
      </div>
      {">"}
      <div className={styles.breadcrumb}>
        <Link href="/mods" blank={!!mode}>
          {"Mods"}
        </Link>
      </div>
      {">"}
      <div className={styles.breadcrumb}>
        <Link href={`/mods/${original.slug}`} blank={!!mode}>
          {mod.title}
        </Link>
      </div>
      {canEdit && !mode && (
        <Button
          style={{ fontSize: "1rem", marginLeft: "auto", padding: "0.25rem 0.5rem" }}
          onClick={() => setMode("edit")}
        >
          <Icon type="edit" size={24} />
          {"Edit"}
        </Button>
      )}
    </div>
  );
}
