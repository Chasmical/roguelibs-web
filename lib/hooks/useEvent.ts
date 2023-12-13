"use client";
import { useLayoutEffect, useRef } from "react";

export default function useEvent<Target extends Window, Type extends keyof WindowEventMap>(
  target: Target,
  type: Type,
  handler: (this: Window, event: WindowEventMap[Type]) => void,
): void;
export default function useEvent<Target extends Document, Type extends keyof DocumentEventMap>(
  target: Target,
  type: Type,
  handler: (this: Document, event: DocumentEventMap[Type]) => void,
): void;
export default function useEvent<Target extends HTMLElement, Type extends keyof HTMLElementEventMap>(
  target: Target,
  type: Type,
  handler: (this: HTMLElement, event: HTMLElementEventMap[Type]) => void,
): void;

export default function useEvent<Target extends EventTarget, Type extends string>(
  target: Target,
  type: Type,
  handler: (this: Target, event: Event) => void | (() => void),
) {
  const handlerRef = useRef(handler);
  const cleanupRef = useRef<ReturnType<typeof handler>>();
  handlerRef.current = handler;

  useLayoutEffect(() => {
    function listener(this: Target, event: Event) {
      cleanupRef.current?.apply(this);
      const returnValue = handlerRef.current.apply(this, [event]);
      cleanupRef.current = typeof returnValue === "function" ? returnValue : undefined;
    }
    target.addEventListener(type, listener);
    return () => {
      target.removeEventListener(type, listener);
      cleanupRef.current?.apply(target);
      cleanupRef.current = undefined;
    };
  }, [target, type]);
}
