"use client";
import useLatest from "@lib/hooks/useLatest";
import { useCallback, useRef, useState } from "react";

export default function useDebounce<Args extends any[]>(
  callback: (...args: Args) => void,
  wait: number,
): [waiting: boolean, start: (...args: Args) => void, reset: () => void] {
  const callbackRef = useLatest(callback);
  const [waiting, setWaiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const start = useCallback(
    (...args: Args) => {
      timeoutRef.current ? clearTimeout(timeoutRef.current) : setWaiting(true);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
        setWaiting(false);
        callbackRef.current(...args);
      }, wait);
    },
    [wait],
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      setWaiting(false);
    }
  }, []);

  return [waiting, start, reset];
}
