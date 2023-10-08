import styles from "./index.module.scss";
import Separator from "@components/Common/Separator";
import Skeleton from "@components/Common/Skeleton";

export default function ModPageSidebarSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <label>{<Skeleton width={140} />}</label>
        <Skeleton count={2} height={42} />
      </div>
      <Separator outset="1rem" />
      <div className={styles.section}>
        <label>{<Skeleton width={100} />}</label>
        <Skeleton round count={2} height={50} />
      </div>
    </div>
  );
}
