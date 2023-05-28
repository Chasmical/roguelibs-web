import { useModPage } from "@components/ModPage";
import styles from "./LeftButtons.module.scss";
import Code from "@components/Common/Code";
import Icon from "@components/Common/Icon";
import clsx from "clsx";

export default function ModPageLeftButtons() {
  const { mod } = useModPage();

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <b>{"Created at:"}</b>
        <span>{new Date(mod.created_at).toLocaleString()}</span>
      </div>
      {mod.edited_at && (
        <div className={styles.panel}>
          <b>{"Edited at:"}</b>
          <span>{new Date(mod.edited_at).toLocaleString()}</span>
        </div>
      )}
      <CopyGuidButton />
    </div>
  );
}

export function CopyGuidButton() {
  const { mod } = useModPage();

  return (
    <div className={clsx(styles.panel, styles.copyGuid)}>
      <span>{"GUID:"}</span>
      <Code>
        {mod.guid}
        <Icon type="copy" size={16} />
      </Code>
    </div>
  );
}
