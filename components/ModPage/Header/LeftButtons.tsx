"use client";
import styles from "./LeftButtons.module.scss";
import Code from "@components/Common/Code";
import clsx from "clsx";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";
import { useId } from "react";
import { formatDate } from "@lib/utils/date";
import { CurrentDate } from "@lib/hooks/useCurrentDate";
import { selectHasChanges, useModPage } from "../redux";

export default function ModPageLeftButtons() {
  function ModCreatedAt() {
    const created_at = useModPage(s => s.mod.created_at);
    return formatDate(created_at);
  }
  function ModEditedAtPanel() {
    const hasChanges = useModPage(selectHasChanges);
    const edited_at = useModPage(s => s.mod.edited_at);

    if (edited_at || hasChanges) {
      return (
        <div className={styles.panel}>
          <b>{"Edited at:"}</b>
          <span>{hasChanges ? <CurrentDate /> : formatDate(edited_at!)}</span>
        </div>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <b>{"Created at:"}</b>
        <span>
          <ModCreatedAt />
        </span>
      </div>
      <ModEditedAtPanel />
      <CopyGuidButton />
    </div>
  );
}

export function CopyGuidButton() {
  const tooltipId = useId();
  const guid = useModPage(s => s.mod.guid);

  if (!guid) return null;

  function copyGuid() {
    navigator.clipboard.writeText(guid!);
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
