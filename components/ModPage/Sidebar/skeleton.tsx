import styles from "./index.module.scss";
import Skeleton from "@components/Common/Skeleton";

export default function ModPageSidebarSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <label>{<Skeleton width={150} />}</label>
        <Skeleton count={2} height={42} />
      </div>
      <div className={styles.section}>
        <label>{<Skeleton width={65} />}</label>
        <Skeleton round count={2} height={50} />
      </div>
      <div className={styles.section}>
        <label>{<Skeleton width={125} />}</label>
        <Skeleton height={52} />
      </div>
    </div>
  );
}
