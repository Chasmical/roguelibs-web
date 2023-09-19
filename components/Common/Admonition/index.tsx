import styles from "./index.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";
import Icon from "@components/Common/Icon";

export type AdmonitionType = "note" | "tip" | "info" | "caution" | "danger";
export type AdmonitionTypeAlias = keyof typeof aliases;

export interface AdmonitionProps extends HTMLAttributes<HTMLElement> {
  type: AdmonitionType | AdmonitionTypeAlias;
  title?: string;
  className?: string;
  // ...props
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Admonition({ type, title, className, children, ...props }: AdmonitionProps) {
  type = aliasMap[type] ?? (type as AdmonitionType);

  return (
    <div role="panel" {...props} className={clsx(styles.admonition, styles[type], className)}>
      {title && (
        <div className={styles.title}>
          <Icon type="edit" size={24} />
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

const aliases = {
  warn: "caution",
  warning: "caution",
  error: "danger",
} as const;

const aliasMap = aliases as typeof aliases & Record<AdmonitionType, undefined>;
