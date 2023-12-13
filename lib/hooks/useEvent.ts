"use client";
import { useEffect } from "react";
import useLatest from "@lib/hooks/useLatest";

export default function useEvent<Target extends Window, Type extends keyof WindowEventMap>(
  target: Target | null | undefined,
  type: Type,
  handler: (this: Window, event: WindowEventMap[Type]) => void,
): void;
export default function useEvent<Target extends Document, Type extends keyof DocumentEventMap>(
  target: Target | null | undefined,
  type: Type,
  handler: (this: Document, event: DocumentEventMap[Type]) => void,
): void;
export default function useEvent<Target extends HTMLElement, Type extends keyof HTMLElementEventMap>(
  target: Target | null | undefined,
  type: Type,
  handler: (this: HTMLElement, event: HTMLElementEventMap[Type]) => void,
): void;

export default function useEvent<Target extends EventTarget, Type extends string>(
  target: Target | null | undefined,
  type: Type,
  handler: (this: Target, event: Event) => void,
) {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!target) return;

    function listener(this: Target, event: Event) {
      handlerRef.current.apply(this, [event]);
    }
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [target, type]);
}
