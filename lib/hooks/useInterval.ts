import { useEffect } from "react";
import useLatest from "@lib/hooks/useLatest";

export default function useInterval(callback: () => void, interval: number) {
  const callbackRef = useLatest(callback);

  useEffect(() => {
    const timeout = setInterval(() => callbackRef.current(), interval);
    return () => clearTimeout(timeout);
  }, [interval]);
}
