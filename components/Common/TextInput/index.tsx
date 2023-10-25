"use client";
import { forwardRef, useCallback, useRef } from "react";
import useMergedRefs from "@lib/hooks/useMergedRefs";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TextInputProps {
  className?: string;
  value: string | null | undefined;
  placeholder?: string | null | undefined;
  onChange?: (newValue: string) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  autoTrimEnd?: boolean;
  error?: boolean | string | null | undefined;
  // ...props
  style?: React.CSSProperties;
}

const TextInput = forwardRef(function TextInput(
  { className, value, placeholder, onChange, prefix, suffix, autoTrimEnd, error, ...props }: TextInputProps,
  forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
  const inputOnChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => onChange?.(e.target.value),
    [onChange],
  );

  const inputOnBlur = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      if (autoTrimEnd === false) return;
      const value = e.target.value;
      const trimmed = value.trimEnd();
      trimmed.length !== value.length && onChange?.(trimmed);
    },
    [autoTrimEnd, onChange],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useMergedRefs(forwardedRef, inputRef);

  const containerOnClick = useCallback<React.MouseEventHandler>(e => {
    if (e.target === inputRef.current) return;
    e.preventDefault();
    inputRef.current?.focus();
  }, []);

  return (
    <div className={clsx(styles.wrapper, className)} {...props}>
      <div className={clsx(styles.container, !!error && styles.error)} onClick={containerOnClick}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          ref={ref}
          className={styles.input}
          value={value ?? ""}
          placeholder={placeholder ?? ""}
          onChange={inputOnChange}
          onBlur={inputOnBlur}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error !== undefined && <div className={styles.errorField}>{error}</div>}
    </div>
  );
});

export default TextInput;
