import { useEffect } from "react";
import useLatest from "@lib/hooks/useLatest";

export default function useAnimationFrame(callback: (deltaMs: number, elapsedMs: number) => void) {
  const callbackRef = useLatest(callback);

  useEffect(() => {
    let canceled = false;
    const start = performance.now();
    let prev = start;

    function animate(time: DOMHighResTimeStamp) {
      if (canceled) return;
      const delta = time - prev;
      callbackRef.current(delta, (prev = time) - start);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    return () => {
      canceled = true;
    };
  }, []);
}
