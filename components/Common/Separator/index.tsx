import styles from "./index.module.scss";
import clsx from "clsx";

export interface SeparatorProps {
  className?: string;
  primary?: boolean;
  thin?: boolean;
  bold?: boolean;
  vertical?: boolean;
  // ...props
  style?: React.CSSProperties;
}

export default function Separator({ className, primary, thin, bold, vertical, ...props }: SeparatorProps) {
  return (
    <div
      className={clsx(
        styles.separator,
        primary && styles.primary,
        thin && styles.thin,
        bold && styles.bold,
        vertical ? styles.vertical : styles.horizontal,
        className,
      )}
      {...props}
    />
  );
}
