import { ForwardedRef, HTMLAttributes, forwardRef } from "react";
import Icon, { IconProps } from "@components/Common/Icon";
import IconButtonClient from "@components/Common/IconButton/client";

type HTMLButtonProps = HTMLAttributes<HTMLButtonElement>;
interface BaseProps extends Omit<HTMLButtonProps, "disabled" | "children" | "type"> {
  disabled?: boolean | "fake";
}
type ChildlessIconButtonProps = BaseProps & IconProps & { children?: never };
type ChildfulIconButtonProps = BaseProps & { children: React.ReactNode };

export type IconButtonProps = ChildlessIconButtonProps | ChildfulIconButtonProps;

const IconButton = forwardRef(function IconButton(
  { children, ...buttonProps }: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const iconProps = extractIconProps(buttonProps);

  return (
    <IconButtonClient ref={ref} {...(buttonProps as BaseProps)}>
      {/* IconButtonClient is needed to allows <Icon>s to be rendered as server components */}
      {children || <Icon alpha={0.5} {...(iconProps as IconProps)} />}
    </IconButtonClient>
  );
});

export default IconButton;

function extractIconProps(props: Partial<IconButtonProps>): IconProps | null {
  if ("type" in props && props.type !== undefined) {
    const iconProps: IconProps = { type: props.type };
    const iconKeys: (keyof IconProps)[] = ["type", "alpha", "size", "width", "height"];

    for (const propKey in props) {
      let key = propKey as keyof ChildlessIconButtonProps;
      if (props[key] !== undefined && (iconKeys as string[]).includes(key)) {
        (iconProps as any)[key] = props[key];
        delete props[key];
      }
    }
    return iconProps;
  }
  return null;
}
