import styles from "./index.module.scss";
import { useModPage } from "@components/ModPage";
import IconButton from "@components/Common/IconButton";
import { useLocation } from "@lib/hooks";
import Tooltip from "@components/Common/Tooltip";
import ModPageBreadcrumbs from "./Breadcrumbs";
import { useId } from "react";
import ModPageLeftButtons from "@components/ModPage/Header/LeftButtons";
import ModPageRightButtons from "@components/ModPage/Header/RightButtons";

export default function ModPageHeader() {
  const { mod } = useModPage();

  return (
    <>
      <ModPageBreadcrumbs />
      <div className={styles.wrapper}>
        <img
          className={styles.banner}
          src={mod.banner_url ?? "/placeholder.png"}
          alt=""
          onDragStart={e => e.preventDefault()}
        />
        <ModPageLeftButtons />
        <ModPageRightButtons />
        <div className={styles.header}>
          <div className={styles.title}>{mod.title}</div>
          <CopyPermanentLink />
        </div>
      </div>
    </>
  );
}

export function CopyPermanentLink() {
  const { mod } = useModPage();
  const location = useLocation();
  const id = useId();

  function copyLink() {
    navigator.clipboard.writeText(`${location!.origin}/m/${mod.id}`);
  }
  return (
    <>
      <IconButton data-tooltip-id={id} type="link" onClick={copyLink} />
      <Tooltip id={id} openOnClick content="Copied permanent link!" />
    </>
  );
}
