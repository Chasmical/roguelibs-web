import styles from "./index.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";

export type AdmonitionType = "note" | "tip" | "info" | "caution" | "danger";

export interface AdmonitionProps extends HTMLAttributes<HTMLElement> {
  type: AdmonitionType;
  title?: string;
  className?: string;
  // ...props
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Admonition({ type, title, className, children, ...props }: AdmonitionProps) {
  return (
    <div {...props} className={clsx(styles.admonition, styles[type], className)}>
      {title && <h4>{title}</h4>}
      {children}
    </div>
  );
}
