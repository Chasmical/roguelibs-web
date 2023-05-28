import styles from "./index.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  // ...props
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Code({ className, ...props }: CodeProps) {
  return <code className={clsx(styles.code, className)} {...props} />;
}
