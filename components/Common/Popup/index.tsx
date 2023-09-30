"use client";
import Tooltip, { TooltipProps } from "@components/Common/Tooltip";

type OmitProps = "clickable" | "openOnClick" | "isOpen" | "setIsOpen";
export interface PopupProps extends Omit<TooltipProps, OmitProps> {
  open: [boolean, (isOpen: boolean) => void];
}

export default function Popup({ open: [isOpen, setIsOpen], ...props }: PopupProps) {
  return Tooltip({
    clickable: true,
    openOnClick: true,
    isOpen: isOpen,
    setIsOpen: v => v || setIsOpen(false),
    delayHide: 0,
    ...(props as TooltipProps),
  });
}
