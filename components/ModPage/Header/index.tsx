"use client";
import styles from "./index.module.scss";
import { ModPageContext } from "@components/ModPage";
import ModPageBreadcrumbs from "./Breadcrumbs";
import ModPageLeftButtons from "@components/ModPage/Header/LeftButtons";
import ModPageRightButtons from "@components/ModPage/Header/RightButtons";
import CopyLink from "@components/Specialized/CopyLink";
import TextInput from "@components/Common/TextInput";
import LayoutImage from "@components/Common/LayoutImage";

export default function ModPageHeader(props: ModPageContext) {
  const { mod, mutateMod, mode } = props;

  return (
    <>
      <ModPageBreadcrumbs {...props} />
      <div className={styles.wrapper}>
        <LayoutImage src={mod.banner_url ?? "/placeholder.png"} alt="" height="100%" layout={mod.banner_layout} />
        <div className={styles.header}>
          <div className={styles.title}>
            {mode !== "edit" ? (
              <span>{mod.title}</span>
            ) : (
              <TextInput
                className={styles.titleInput}
                value={mod.title}
                onChange={title => mutateMod(m => void (m.title = title))}
                error={title => {
                  if (title.length < 1) return "Title cannot be empty.";
                  if (title.length > 64) return `Exceeded length limit (${title.length}/64).`;
                }}
              />
            )}
          </div>
          <CopyLink permanent href={`/m/${mod.id}`} place="left" />
        </div>
        <ModPageLeftButtons {...props} />
        <ModPageRightButtons {...props} />
      </div>
    </>
  );
}
