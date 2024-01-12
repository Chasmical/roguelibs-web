"use client";
import { useCallback, useId, useRef, useState } from "react";
import useDebounce from "@lib/hooks/useDebounce";
import useResize from "@lib/hooks/useResize";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";
import Icon from "@components/Common/Icon";
import type { CodeBlockProps } from ".";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeBlockWrapperProps extends Pick<CodeBlockProps, "wrap" | "nocopy" | "nonums"> {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  code: string;
}

export default function CodeBlockWrapper({
  className,
  style,
  children,
  code,
  wrap: defaultWrap,
  nocopy,
  nonums,
}: CodeBlockWrapperProps) {
  const [showTooltip, displayTooltip] = useDebounce(() => {}, 3000);
  const [isScrollable, setIsScrollable] = useState(false);
  const [userWrap, setUserWrap] = useState<boolean>();
  const preRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  const keyDown = useCallback<React.KeyboardEventHandler>(e => {
    if (isKeyForEditing(e)) {
      // tell the user that the code block is not editable
      e.preventDefault();
      displayTooltip();
      return;
    }
    if (e.ctrlKey && e.code === "KeyA") {
      // select code block's contents instead of the entire page
      e.preventDefault();
      const selection = getSelection()!;
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  useResize([preRef, codeRef], () => {
    setIsScrollable(codeRef.current!.scrollWidth > preRef.current!.clientWidth);
  });

  const wrap = userWrap ?? defaultWrap;

  const toggleWrap = useCallback(() => {
    let newWrap: boolean | undefined;
    setUserWrap(u => (newWrap = !(u ?? defaultWrap)));
    if (!newWrap) setIsScrollable(true);
  }, [defaultWrap]);

  return (
    <>
      <pre ref={preRef} className={clsx(styles.pre, className)} style={style} tabIndex={0} onKeyDown={keyDown}>
        <code ref={codeRef} className={clsx(styles.code, wrap && styles.wrap, nonums || styles.withLineNumbers)}>
          {children}
        </code>
      </pre>
      <div className={styles.toolbar}>
        {(isScrollable || wrap) && <WrapButton wrap={wrap} toggleWrap={toggleWrap} />}
        {nocopy || <CopyButton code={code} />}
      </div>
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
    <IconButton className={styles.toolbarButton} data-tooltip-id={id} onClick={onCopy}>
      <Icon type="copy" size={24} alpha={0.5} />
      <Tooltip id={id} openOnClick content="Copied!" place="top" />
    </IconButton>
  );
}
function WrapButton({ wrap, toggleWrap }: { wrap?: boolean; toggleWrap: () => void }) {
  return (
    <IconButton className={styles.toolbarButton} onClick={toggleWrap}>
      <Icon type="options" size={24} alpha={wrap ? 1 : 0.5} />
    </IconButton>
  );
}

function isKeyForEditing(e: React.KeyboardEvent) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return false;
  if (e.key?.length === 1) return true;
  return specialEditingKeys.includes(e.code);
}
const specialEditingKeys = ["Enter", "Backspace", "Delete"];
