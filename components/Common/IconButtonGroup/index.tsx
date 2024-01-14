import { Children, cloneElement } from "react";
import type { IconButtonProps } from "@components/Common/IconButton";
import styles from "./index.module.scss";
import clsx from "clsx";

type DivProps = React.HTMLProps<HTMLDivElement>;

export interface IconButtonGroupProps<Value extends string | number> extends Omit<DivProps, "value" | "onChange"> {
  value?: Value;
  onChange?: (newValue: Value | null) => void;
  choices?: { value: Value; icon: React.ReactNode }[];
}

export default function IconButtonGroup<Value extends string | number>({
  children,
  value,
  onChange,
  className,
  ...props
}: IconButtonGroupProps<Value>) {
  return (
    <div className={clsx(styles.group, className)} {...props}>
      {value !== undefined ? (
        <>
          {Children.toArray(children)
            .filter(Boolean)
            .map(elem => {
              const button = elem as React.ReactElement<IconButtonProps>;
              const choice = (button.props.value ?? null) as Value | null;
              return cloneElement(button, {
                active: choice === value,
                onClick: () => onChange?.(value !== choice ? choice : null),
              });
            })}
        </>
      ) : (
        children
      )}
    </div>
  );
}
