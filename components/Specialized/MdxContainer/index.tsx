import styles from "./index.module.scss";
import clsx from "clsx";

export interface MdxWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  concise?: boolean;
}

export default function MdxWrapper({ className, concise, ...props }: MdxWrapperProps) {
  return <div className={clsx(styles.markdown, concise && styles.concise, className)} {...props} />;
}
