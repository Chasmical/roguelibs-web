import { Ref, forwardRef } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef(function Button({ className, ...props }: ButtonProps, ref: Ref<HTMLButtonElement>) {
  return <button ref={ref} className={clsx(styles.button, className)} {...props} />;
});
export default Button;
