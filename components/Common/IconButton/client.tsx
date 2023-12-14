"use client";
import { forwardRef } from "react";
import useDebounce from "@lib/hooks/useDebounce";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLButtonProps = React.HTMLAttributes<HTMLButtonElement>;
export interface IconButtonClientProps extends Omit<HTMLButtonProps, "disabled"> {
  disabled?: boolean | "fake";
}

const IconButtonClient = forwardRef(function IconButtonClient(
  { className, disabled, children, ...props }: IconButtonClientProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const [fakeActive, startFakeActive] = useDebounce((button: HTMLButtonElement) => button.blur(), 100);

  return (
    <button
      ref={ref}
      className={clsx(
        styles.iconButton,
        disabled === "fake" && styles.disabled,
        fakeActive && styles.fakeActive,
        className,
      )}
      onPointerDown={e => startFakeActive(e.currentTarget)}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButtonClient;
