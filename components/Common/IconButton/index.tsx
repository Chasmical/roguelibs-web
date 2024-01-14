"use client";
import { forwardRef } from "react";
import Icon, { IconType } from "@components/Common/Icon";
import useDebounce from "@lib/hooks/useDebounce";
import styles from "./index.module.scss";
import clsx from "clsx";

type HTMLButtonProps = React.HTMLAttributes<HTMLButtonElement>;
export interface IconButtonProps extends Omit<HTMLButtonProps, "type"> {
  type?: IconType;
  size?: number;
  square?: boolean;
  active?: boolean;
  value?: string | number; // used in <IconButtonGroup>
}

const IconButton = forwardRef(function IconButton(
  { type, size, square, active, className, children, ...props }: IconButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const [fakeActive, startFakeActive] = useDebounce((button: HTMLButtonElement) => button.blur(), 100);

  return (
    <button
      ref={ref}
      className={clsx(
        styles.iconButton,
        fakeActive && styles.fakeActive,
        active && styles.active,
        square && styles.square,
        className,
      )}
      onPointerDown={e => startFakeActive(e.currentTarget)}
      {...props}
    >
      {type && <Icon type={type} size={size} />}
      {children}
    </button>
  );
});

export default IconButton;
