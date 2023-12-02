import styles from "./index.module.scss";
import breads from "./Breadcrumbs.module.scss";
import leftbs from "./LeftButtons.module.scss";
import rights from "./RightButtons.module.scss";
import Link from "@components/Common/Link";
import Skeleton from "@components/Common/Skeleton";
import clsx from "clsx";

export default function ModPageHeaderSkeleton() {
  return (
    <>
      <ModPageBreadcrumbsSkeleton />
      <div className={clsx(styles.wrapper, styles.expanded)}>
        <Skeleton width="100%" height="100%" />
        <div className={styles.header}>
          <div className={styles.title}>
            <Skeleton width={300} />
          </div>
          <Skeleton circle width={40} />
        </div>
        <ModPageLeftButtonsSkeleton />
        <ModPageRightButtonsSkeleton />
      </div>
    </>
  );
}

export function ModPageBreadcrumbsSkeleton() {
  return (
    <div className={breads.breadcrumbs}>
      <div className={breads.breadcrumb}>
        <Link href="/">{"RL"}</Link>
      </div>
      {">"}
      <div className={breads.breadcrumb}>
        <Link href="/mods">{"Mods"}</Link>
      </div>
      {">"}
      <div className={breads.breadcrumb}>
        <Link>
          <Skeleton width={150} />
        </Link>
      </div>
    </div>
  );
}

export function ModPageLeftButtonsSkeleton() {
  return (
    <div className={leftbs.container}>
      <div className={leftbs.panel}>
        <Skeleton width={200} />
      </div>
      <div className={leftbs.panel}>
        <Skeleton width={200} />
      </div>
      <div className={leftbs.panel}>
        <Skeleton width={350} />
      </div>
    </div>
  );
}

export function ModPageRightButtonsSkeleton() {
  return (
    <div className={rights.container}>
      <div className={rights.row}>
        <Skeleton button width={90} height={52} />
        <Skeleton button width={170} height={52} />
        <Skeleton button width={36} height={52} />
      </div>
    </div>
  );
}
