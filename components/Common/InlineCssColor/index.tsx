import Code from "@components/Common/Code";
import styles from "./index.module.scss";

export interface InlineCssColorProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}
export default function InlineCssColor({ color, ...props }: InlineCssColorProps) {
  return (
    <Code {...props}>
      <span className={styles.color} style={{ backgroundColor: color }} />
      {color}
    </Code>
  );
}
