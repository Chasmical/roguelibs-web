import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  // ...props
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Code({ className, ...props }: CodeProps) {
  return <code className={clsx(styles.code, className)} {...props} />;
}
