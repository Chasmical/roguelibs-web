import { useModPage } from "@components/ModPage";
import styles from "./index.module.scss";

export default function ModPageBody() {
  const { mod } = useModPage();

  return <div className={styles.wrapper}>{mod.description}</div>;
}
