import ModPageHeaderSkeleton from "@components/ModPage/Header/skeleton";
import ModPageBodySkeleton from "@components/ModPage/Body/skeleton";
import ModPageSidebarSkeleton from "@components/ModPage/Sidebar/skeleton";
import styles from "./index.module.scss";

export default function ModPageSkeleton() {
  return (
    <div className={styles.container}>
      <ModPageHeaderSkeleton />
      <div className={styles.sides}>
        <ModPageBodySkeleton />
        <ModPageSidebarSkeleton />
      </div>
    </div>
  );
}
