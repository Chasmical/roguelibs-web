import { HTMLAttributes } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TabItemProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  values?: string | string[];
  label?: React.ReactNode;
  labels?: string | string[];
  default?: boolean | number | string;
  className?: string;
  children?: React.ReactNode;
  // ...props
}

export default function TabItem({ className, children, ...props }: TabItemProps) {
  return (
    <div role="tabpanel" className={clsx(styles.container, className)} {...props}>
      {children}
    </div>
  );
}
