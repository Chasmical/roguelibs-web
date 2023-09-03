import clsx from "clsx";
import styles from "./index.module.scss";

export interface DragHandleProps extends React.HTMLProps<HTMLDivElement> {
  place?: "left" | "right";
}
export default function DragHandle({ className, place, ...props }: DragHandleProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={clsx(styles.handle, styles[place ?? "left"])} {...props}>
        <div className={styles.dots} />
      </div>
    </div>
  );
}
