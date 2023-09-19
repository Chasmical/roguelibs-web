import styles from "./index.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  // ...props
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  return (
    <div role="panel" {...props}>
      <div>My code block</div>
      <pre className={clsx(styles.pre, className)}>{children}</pre>
    </div>
  );
}
