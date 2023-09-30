"use client";
import styles from "./index.module.scss";
import { ModPageContext } from "@components/ModPage";
import ModPageBreadcrumbs from "./Breadcrumbs";
import ModPageLeftButtons from "@components/ModPage/Header/LeftButtons";
import ModPageRightButtons from "@components/ModPage/Header/RightButtons";
import CopyLink from "@components/Specialized/CopyLink";
import clsx from "clsx";

export default function ModPageHeader(props: ModPageContext) {
  const { mod } = props;

  return (
    <>
      <ModPageBreadcrumbs {...props} />
      <div className={styles.wrapper}>
        <img
          draggable="false"
          className={clsx(styles.banner, styles[bannerLayouts[mod.banner_layout - 1]])}
          src={mod.banner_url ?? "/placeholder.png"}
          alt=""
        />
        <div className={styles.header}>
          <div className={styles.title}>{mod.title}</div>
          <CopyLink permanent href={`/m/${mod.id}`} place="left" />
        </div>
        <ModPageLeftButtons {...props} />
        <ModPageRightButtons {...props} />
      </div>
    </>
  );
}
const bannerLayouts = [
  "widthTop",
  "widthMiddle",
  "widthBottom",
  "heightLeft",
  "heightCenter",
  "heightRight",
  "stretch",
] as const;
