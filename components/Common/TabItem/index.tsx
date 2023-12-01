"use client";
import { HTMLAttributes } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TabItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value?: string;
  values?: string | string[];
  label?: React.ReactNode;
  labels?: string | string[];
  default?: boolean | number | string;
  className?: string;
  children?: React.ReactNode | (() => React.ReactNode);
  // ...props
}

export default function TabItem({ className, children, ...otherProps }: TabItemProps) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { value, values, label, labels, default: d, ...props } = otherProps;

  return (
    <div role="tabpanel" className={clsx(styles.container, className)} {...props}>
      {typeof children === "function" ? children() : children}
    </div>
  );
}
