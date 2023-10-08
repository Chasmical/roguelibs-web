import Skeleton from "@components/Common/Skeleton";
import styles from "./index.module.scss";

export default function ModPageBodySkeleton() {
  return (
    <div className={styles.wrapper}>
      <div>
        <div className="markdown">
          <h1>{<Skeleton width={300} />}</h1>
          <Skeleton count={8} />
        </div>
      </div>
    </div>
  );
}
