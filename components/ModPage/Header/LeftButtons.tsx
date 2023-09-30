import { useModPage } from "@components/ModPage";
import styles from "./LeftButtons.module.scss";
import Code from "@components/Common/Code";
import clsx from "clsx";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";
import { useId } from "react";
import { formatDate } from "@lib/utils/date";

export default function ModPageLeftButtons() {
  const { mod } = useModPage();

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <b>{"Created at:"}</b>
        <span>{formatDate(mod.created_at)}</span>
      </div>
      {mod.edited_at && (
        <div className={styles.panel}>
          <b>{"Edited at:"}</b>
          <span>{formatDate(mod.edited_at)}</span>
        </div>
      )}
      {mod.guid && <CopyGuidButton />}
    </div>
  );
}

export function CopyGuidButton() {
  const { mod } = useModPage();
  const tooltipId = useId();

  function copyGuid() {
    navigator.clipboard.writeText(mod.guid!);
  }

  return (
    <>
      <div className={clsx(styles.panel, styles.copyGuid)}>
        <span>{"GUID:"}</span>
        <Code>
          {mod.guid}
          <IconButton data-tooltip-id={tooltipId} type="copy" size={16} onClick={copyGuid} />
        </Code>
      </div>
      <Tooltip id={tooltipId} openOnClick content="Copied GUID!" place="right" />
    </>
  );
}
