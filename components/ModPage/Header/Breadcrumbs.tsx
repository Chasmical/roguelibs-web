import { useModPage } from "@components/ModPage";
import styles from "./Breadcrumbs.module.scss";
import Link from "@components/Common/Link";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { useApi } from "@lib/API.Hooks";

export default function ModPageBreadcrumbs() {
  const { mod, original, isEditing, setIsEditing } = useModPage();
  const modLink = `/mods/${original.slug}`;

  const me = useApi().currentUser;
  const canEdit = original.authors.some(a => a.user_id === me?.id) || me?.is_admin;

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
      {canEdit && (
        <Button
          style={{ fontSize: "1rem", marginLeft: "auto", padding: "0.25rem 0.5rem" }}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Icon type="edit" size={24} />
          {"Edit"}
        </Button>
      )}
    </div>
  );
}
