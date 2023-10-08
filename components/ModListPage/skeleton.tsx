import Skeleton from "@components/Common/Skeleton";
import styles from "./index.module.scss";

export default function ModListPageSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{"Mods"}</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.categories}></div>
        <div className={styles.list}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} width={200} height={145} />
          ))}
        </div>
      </div>
    </div>
  );
}
