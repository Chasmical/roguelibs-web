"use client";
import styles from "./Breadcrumbs.module.scss";
import Link from "@components/Common/Link";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { useApi } from "@lib/API.Hooks";
import { useModPage, useModPageDispatch } from "../redux";

export default function ModPageBreadcrumbs() {
  const mode = useModPage(s => s.mode);
  const originalSlug = useModPage(s => s.original.slug);

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
        <Link href={`/mods/${originalSlug}`} blank={!!mode}>
          <BreadcrumbTitle />
        </Link>
      </div>
      {!mode && <EditButton />}
    </div>
  );
}

function BreadcrumbTitle() {
  const title = useModPage(s => s.mod.title);
  return <span>{title}</span>;
}

function EditButton() {
  const me = useApi().currentUser;

  const dispatch = useModPageDispatch();
  const canEdit = useModPage(s => s.original.authors.some(a => a.user_id === me?.id) || me?.is_admin);

  if (!canEdit) return null;

  return (
    <Button
      style={{ fontSize: "1rem", marginLeft: "auto", padding: "0.25rem 0.5rem" }}
      onClick={() => dispatch(s => (s.mode = "edit"))}
    >
      <Icon type="edit" size={24} />
      {"Edit"}
    </Button>
  );
}
