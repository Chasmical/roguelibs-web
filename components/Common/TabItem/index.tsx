"use client";
import { IconType } from "@components/Common/Icon";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TabItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  className?: string;
  children?: React.ReactNode | (() => React.ReactNode);
  // ...otherProps
  value?: string;
  values?: string | string[];
  label?: React.ReactNode;
  labels?: string | string[];
  icon?: IconType | null;
  default?: boolean | number | string;
}

export default function TabItem({ className, children, hidden, ...otherProps }: TabItemProps) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { value, values, label, labels, icon, default: d, ...props } = otherProps;

  return (
    <div role="tabpanel" className={clsx(styles.container, className)} hidden={hidden} {...props}>
      {typeof children === "function" ? (hidden ? null : children()) : children}
    </div>
  );
}
