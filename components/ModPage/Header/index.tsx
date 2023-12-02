"use client";
import styles from "./index.module.scss";
import ModPageBreadcrumbs from "./Breadcrumbs";
import ModPageLeftButtons from "./LeftButtons";
import ModPageRightButtons from "./RightButtons";
import CopyLink from "@components/Specialized/CopyLink";
import TextInput from "@components/Common/TextInput";
import LayoutImage from "@components/Common/LayoutImage";
import { useModPage, useModPageDispatch } from "../redux";

export default function ModPageHeader() {
  const id = useModPage(s => s.mod.id);

  return (
    <>
      <ModPageBreadcrumbs />
      <div className={styles.wrapper}>
        <ModBanner />
        <div className={styles.header}>
          <div className={styles.title}>
            <ModTitle />
          </div>
          <CopyLink permanent href={`/m/${id}`} place="left" />
        </div>
        <ModPageLeftButtons />
        <ModPageRightButtons />
      </div>
    </>
  );
}

function ModBanner() {
  const banner_url = useModPage(s => s.mod.banner_url);
  const banner_layout = useModPage(s => s.mod.banner_layout);

  return <LayoutImage src={banner_url ?? "/placeholder.png"} alt="" height="100%" layout={banner_layout} />;
}

function ModTitle() {
  const mode = useModPage(s => s.mode);
  const dispatch = useModPageDispatch();
  const title = useModPage(s => s.mod.title);

  if (mode !== "edit") return <span>{title}</span>;

  return (
    <TextInput
      className={styles.titleInput}
      value={title}
      onChange={title => dispatch(m => (m.mod.title = title))}
      error={title => {
        if (title.length < 1) return "Title cannot be empty.";
        if (title.length > 64) return `Exceeded length limit (${title.length}/64).`;
      }}
    />
  );
}
