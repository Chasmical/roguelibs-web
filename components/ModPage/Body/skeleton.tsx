import Skeleton from "@components/Common/Skeleton";
import styles from "./index.module.scss";
import Tabs from "@components/Common/Tabs";
import TabItem from "@components/Common/TabItem";

export default function ModPageBodySkeleton() {
  return (
    <div className={styles.wrapper}>
      <Tabs className={styles.bodyTabs} lazy faded>
        <TabItem icon="copy" label="Description">
          <h1>{<Skeleton width={300} />}</h1>
          <Skeleton count={8} />
        </TabItem>
        <TabItem icon="copy" label="Releases" />
      </Tabs>
    </div>
  );
}
