"use client";
import { createContext, useCallback, useContext, useLayoutEffect, useRef } from "react";

type ScrollBlockInfo = [elem: HTMLElement, top: number];
const ScrollBlockContext = createContext<React.MutableRefObject<ScrollBlockInfo | null> | undefined>(undefined);

export function ScrollControllerProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<ScrollBlockInfo>(null);
  return <ScrollBlockContext.Provider value={ref}>{children}</ScrollBlockContext.Provider>;
}

export default function useScrollPositionBlocker(): (element: HTMLElement) => void {
  const scrollController = useContext(ScrollBlockContext);
  const nextLayoutEffectCallbackRef = useRef<() => void>();

  const blockElementScrollPositionUntilNextRender = useCallback(
    (element: HTMLElement) => {
      if (!element || !scrollController) return;
      scrollController.current = [element, element.getBoundingClientRect().top];

      nextLayoutEffectCallbackRef.current = () => {
        if (!scrollController.current) return;
        const [elem, lastTop] = scrollController.current;

        const heightDiff = elem.getBoundingClientRect().top - lastTop;
        heightDiff && window.scrollBy({ left: 0, top: heightDiff });
        nextLayoutEffectCallbackRef.current = undefined;
        scrollController.current = null;
      };
    },
    [scrollController],
  );

  useLayoutEffect(() => {
    queueMicrotask(() => nextLayoutEffectCallbackRef.current?.());
  });

  return blockElementScrollPositionUntilNextRender;
}
