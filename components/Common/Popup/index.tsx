"use client";
import Tooltip, { TooltipProps } from "@components/Common/Tooltip";

type OmitProps = "clickable" | "openOnClick";
export interface PopupProps extends Omit<TooltipProps, OmitProps> {}

export default function Popup({ isOpen, setIsOpen, ...props }: PopupProps) {
  return Tooltip({
    clickable: true,
    openOnClick: true,
    isOpen: isOpen,
    setIsOpen: v => v || setIsOpen?.(false),
    delayHide: 0,
    ...(props as TooltipProps),
  });
}
