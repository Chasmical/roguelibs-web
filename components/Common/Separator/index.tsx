import styles from "./index.module.scss";
import clsx from "clsx";

export interface SeparatorProps {
  className?: string;
  primary?: boolean;
  thin?: boolean;
  bold?: boolean;
  vertical?: boolean;
  outset?: string | number;
  style?: React.CSSProperties;
  // ...props
}

export default function Separator({
  className,
  primary,
  thin,
  bold,
  vertical,
  outset,
  style,
  ...props
}: SeparatorProps) {
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
      style={getOutsetStyle(outset, style, vertical)}
      {...props}
    />
  );
}
function getOutsetStyle(
  outset: string | number | null | undefined,
  style: React.CSSProperties | undefined,
  vertical?: boolean,
): React.CSSProperties | undefined {
  if (outset == null) return style;
  if (typeof outset === "number") outset = outset + "px";
  if (vertical) {
    return { height: `calc(100% + 2 * ${outset})`, marginTop: "-" + outset };
  } else {
    return { width: `calc(100% + 2 * ${outset})`, marginLeft: "-" + outset };
  }
}
