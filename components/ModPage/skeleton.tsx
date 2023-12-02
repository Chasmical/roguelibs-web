import ModPageHeaderSkeleton from "./Header/skeleton";
import ModPageBodySkeleton from "./Body/skeleton";
import ModPageSidebarSkeleton from "./Sidebar/skeleton";
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
