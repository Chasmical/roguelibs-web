import { Ref, forwardRef } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sleek?: boolean;
}

const Button = forwardRef(function Button({ className, sleek, ...props }: ButtonProps, ref: Ref<HTMLButtonElement>) {
  return <button ref={ref} className={clsx(styles.button, sleek && styles.sleek, className)} {...props} />;
});
export default Button;
