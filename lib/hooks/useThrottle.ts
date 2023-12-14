import { useEffect, useMemo } from "react";
import useLatest from "@lib/hooks/useLatest";
import lodashThrottle from "lodash/throttle";

export default function useThrottle(callback: () => void, [delay, ...deps]: [number, ...React.DependencyList]) {
  const callbackRef = useLatest(callback);

  const throttledCb = useMemo(() => {
    return lodashThrottle(() => callbackRef.current(), delay, { leading: true, trailing: true });
  }, [delay]);

  useEffect(() => void throttledCb(), [throttledCb, ...deps]);
}
