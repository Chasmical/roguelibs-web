import Icon from "@components/Common/Icon";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div>{"RogueLibs Web is working!"}</div>
      <Icon type="nugget" />
      <Icon type="nugget" color="red" />
      <Icon type="nugget" color="blue" />
    </div>
  );
}
