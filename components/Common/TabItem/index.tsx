import { HTMLAttributes } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface TabItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  // ...props
  value: string | string[];
}

export default function TabItem({ className, children, ...props }: TabItemProps) {
  return (
    <div role="tabpanel" className={clsx(styles.container, className)} {...props}>
      {children}
    </div>
  );
}
