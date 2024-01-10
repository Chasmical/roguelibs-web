"use client";
import { useId } from "react";
import useDebounce from "@lib/hooks/useDebounce";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";
import Icon from "@components/Common/Icon";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeBlockWrapperProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  nocopy?: boolean;
  code: string;
}

export default function CodeBlockWrapper({ className, style, children, nocopy, code }: CodeBlockWrapperProps) {
  const [showTooltip, displayTooltip] = useDebounce(() => {}, 3000);

  const keyDown: React.KeyboardEventHandler = e => {
    if (!e.ctrlKey && !e.altKey) {
      e.preventDefault();
      displayTooltip();
    }
  };

  return (
    <>
      <pre className={clsx(styles.pre, className)} style={style} tabIndex={0} onKeyDown={keyDown}>
        {children}
      </pre>
      <div className={styles.buttons}>{nocopy || <CopyButton code={code} />}</div>
      <div className={styles.tooltip} style={{ opacity: +showTooltip }}>
        {"This code is not editable."}
      </div>
    </>
  );
}

function CopyButton({ code }: { code: string }) {
  const id = useId();
  const onCopy = () => navigator.clipboard.writeText(code);

  return (
    <IconButton data-tooltip-id={id} className={styles.copyButton} onClick={onCopy}>
      <Icon type="copy" size={24} alpha={0.5} />
      <Tooltip id={id} openOnClick content="Copied!" place="left" />
    </IconButton>
  );
}
