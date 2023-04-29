"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./index.scss";

export type ReactTooltipProps = Parameters<typeof ReactTooltip>[0];
type TooltipRenderProp = NonNullable<ReactTooltipProps["render"]>;

export type TooltipProps = Omit<ReactTooltipProps, "content" | "children" | "render" | "html" | "variant"> &
  (
    | { content: string; children?: never; render?: never; html?: never }
    | { children: React.ReactNode | TooltipRenderProp; content?: never; render?: never; html?: never }
    | { render: TooltipRenderProp; content?: never; children?: never; html?: never }
    | { html: string; content?: never; children?: never; render?: never }
  );

export default function Tooltip({ ...props }: TooltipProps) {
  if (typeof props.children === "function") {
    (props as ReactTooltipProps).render = props.children;
    delete props.children;
  }
  return ReactTooltip(props as ReactTooltipProps);
}
