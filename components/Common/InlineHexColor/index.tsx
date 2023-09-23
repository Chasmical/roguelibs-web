import Code from "@components/Common/Code";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface InlineHexColorProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}
export default function InlineHexColor({ color, className, ...props }: InlineHexColorProps) {
  if (!color.startsWith("#")) color = "#" + color;

  return (
    <Code className={clsx(styles.code, className)} {...props}>
      <span className={styles.color} style={{ backgroundColor: color }} />
      {color}
    </Code>
  );
}
