"use client";
import { HTMLAttributes, Ref, forwardRef, useCallback, useRef, useState } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLButtonProps = HTMLAttributes<HTMLButtonElement>;
export interface IconButtonClientProps extends Omit<HTMLButtonProps, "disabled"> {
  disabled?: boolean | "fake";
}

const IconButtonClient = forwardRef(function IconButtonClient(
  { className, disabled, children, ...props }: IconButtonClientProps,
  ref: Ref<HTMLButtonElement>,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [fakeActive, setFakeActive] = useState(false);

  const onPointerDown = useCallback(() => {
    setFakeActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFakeActive(false), 100);
  }, []);

  return (
    <button
      ref={ref}
      className={clsx(
        styles.iconButton,
        disabled === "fake" && styles.disabled,
        fakeActive && styles.fakeActive,
        className,
      )}
      onPointerDown={onPointerDown}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButtonClient;
