"use client";
import { ModPageContext } from "@components/ModPage";
import styles from "./LeftButtons.module.scss";
import Code from "@components/Common/Code";
import clsx from "clsx";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";
import { useId } from "react";
import { formatDate } from "@lib/utils/date";
import { CurrentDate } from "@lib/hooks/useCurrentDate";

export default function ModPageLeftButtons(props: ModPageContext) {
  const { mod, hasChanges } = props;

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <b>{"Created at:"}</b>
        <span>{formatDate(mod.created_at)}</span>
      </div>
      {(mod.edited_at || hasChanges) && (
        <div className={styles.panel}>
          <b>{"Edited at:"}</b>
          <span>{hasChanges ? <CurrentDate /> : formatDate(mod.edited_at!)}</span>
        </div>
      )}
      {mod.guid && <CopyGuidButton guid={mod.guid} />}
    </div>
  );
}

export function CopyGuidButton({ guid }: { guid: string }) {
  const tooltipId = useId();

  function copyGuid() {
    navigator.clipboard.writeText(guid);
  }

  return (
    <>
      <div className={clsx(styles.panel, styles.copyGuid)}>
        <span>{"GUID:"}</span>
        <Code>
          {guid}
          <IconButton data-tooltip-id={tooltipId} type="copy" size={16} onClick={copyGuid} />
        </Code>
      </div>
      <Tooltip id={tooltipId} openOnClick content="Copied GUID!" place="right" />
    </>
  );
}
