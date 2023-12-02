"use client";
import { forwardRef, useCallback, useRef } from "react";
import useMergedRefs from "@lib/hooks/useMergedRefs";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TextAreaProps {
  className?: string;
  value: string | null | undefined;
  placeholder?: string | null | undefined;
  onChange?: (newValue: string) => void;
  autoTrimEnd?: boolean;
  minHeight?: string;
  error?: ((value: string) => string | null | undefined | void) | string | null | undefined;
  // ...props
  style?: React.CSSProperties;
}

const TextArea = forwardRef(function TextArea(
  { className, value, onChange, placeholder, autoTrimEnd, minHeight, error, ...props }: TextAreaProps,
  forwardedRef: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const textareaOnChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    e => onChange?.(e.target.value),
    [onChange],
  );

  const textareaOnBlur = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    e => {
      if (autoTrimEnd === false) return;
      const value = e.target.value;
      const trimmed = value.trimEnd();
      trimmed.length !== value.length && onChange?.(trimmed);
    },
    [autoTrimEnd, onChange],
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ref = useMergedRefs(forwardedRef, textareaRef);

  const containerOnClick = useCallback<React.MouseEventHandler>(e => {
    if (e.target === textareaRef.current) return;
    e.preventDefault();
    textareaRef.current?.focus();
  }, []);

  if (typeof error === "function") {
    error = error(value ?? "") ?? null;
  }

  return (
    <div className={clsx(styles.wrapper, className)} {...props}>
      <div className={clsx(styles.container, !!error && styles.error)} onClick={containerOnClick}>
        <textarea
          ref={ref}
          className={styles.textarea}
          value={value ?? ""}
          placeholder={placeholder ?? undefined}
          onChange={textareaOnChange}
          onBlur={textareaOnBlur}
          style={{ minHeight: minHeight }}
        />
      </div>
      {error !== undefined && <div className={styles.errorField}>{error}</div>}
    </div>
  );
});

export default TextArea;
