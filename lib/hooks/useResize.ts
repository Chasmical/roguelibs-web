import useLatest from "@lib/hooks/useLatest";
import { useEffect, useState } from "react";

type MaybeArray<T> = T | T[];

export default function useResize<TElement extends Element>(
  target: TElement | React.RefObject<TElement>,
  callback: (entry: ResizeObserverEntry & { target: TElement }) => void,
): void;
export default function useResize<TElement extends Element>(
  target: (TElement | React.RefObject<TElement>)[],
  callback: (entries: (ResizeObserverEntry & { target: TElement })[]) => void,
): void;
export default function useResize<TElement extends Element>(
  target: MaybeArray<TElement | React.RefObject<TElement>>,
  callback: (entry: any) => void,
): void {
  const callbackRef = useLatest(callback);
  const [observer] = useState(() => {
    if (typeof window === "undefined") return null!;
    return new ResizeObserver(entries => {
      callbackRef.current(Array.isArray(target) ? entries : entries[0]);
    });
  });

  const elems = (Array.isArray(target) ? target : [target]).map(t => ("current" in t ? t.current : t));

  useEffect(() => {
    const cleanup = elems.map(elem => elem && (observer.observe(elem), () => observer.unobserve(elem)));
    return () => cleanup.forEach(c => c?.());
  }, elems);
}
