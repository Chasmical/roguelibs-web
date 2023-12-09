import Code from "@components/Common/Code";
import styles from "./index.module.scss";

export interface InlineHexColorProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}
export default function InlineHexColor({ color, ...props }: InlineHexColorProps) {
  return (
    <Code {...props}>
      <span className={styles.color} style={{ backgroundColor: color }} />
      {color}
    </Code>
  );
}
