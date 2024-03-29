"use client";
import { Tooltip as ReactTooltip, ITooltip } from "react-tooltip";
import "./index.scss";

export type ReactTooltipProps = ITooltip;
type TooltipRenderProp = NonNullable<ReactTooltipProps["render"]>;

// safer props type (to prevent ambigious usage of content-rendering props)
export type TooltipProps = Omit<ReactTooltipProps, "content" | "children" | "render" | "html"> &
  (
    | { content: string; children?: never; render?: never; html?: never }
    | { children: React.ReactNode | TooltipRenderProp; content?: never; render?: never; html?: never }
    | { render: TooltipRenderProp; content?: never; children?: never; html?: never }
    | { html: string; content?: never; children?: never; render?: never }
  );

export default function Tooltip({ ...props }: TooltipProps) {
  if (typeof props.children === "function") {
    // allow passing a render function inside of a component tag
    (props as ReactTooltipProps).render = props.children;
    delete props.children;
  }
  if (props.openOnClick) {
    props.delayHide ??= 3000;
    if (props.delayHide) {
      props.closeEvents ??= closeEvents;
    }
  }
  return <ReactTooltip {...(props as ReactTooltipProps)} />;
}

const closeEvents: ReactTooltipProps["closeEvents"] = { mouseleave: true, blur: true };
