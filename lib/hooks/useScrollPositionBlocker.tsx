"use client";
import { createContext, useCallback, useContext, useLayoutEffect, useRef } from "react";

type ScrollBlockInfo = [elem: HTMLElement, top: number];
const ScrollControllerContext = createContext<React.MutableRefObject<ScrollBlockInfo | null> | undefined>(undefined);

export function ScrollControllerProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<ScrollBlockInfo>(null);
  return <ScrollControllerContext.Provider value={ref}>{children}</ScrollControllerContext.Provider>;
}

export default function useScrollPositionBlocker(): (element: HTMLElement) => void {
  const scrollController = useContext(ScrollControllerContext)!;
  const nextLayoutEffectCallbackRef = useRef<(() => void) | undefined>(undefined);

  const blockElementScrollPositionUntilNextRender = useCallback(
    (element: HTMLElement) => {
      if (!element) return;
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
