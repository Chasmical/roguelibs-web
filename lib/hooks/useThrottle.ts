import { useCallback, useEffect, useRef } from "react";
import lodashThrottle from "lodash/throttle";

export default function useThrottle<Func extends Function>(
  cb: Func,
  [delay, ...deps]: [number, ...React.DependencyList],
) {
  const cbRef = useRef(cb);

  const throttledCb = useCallback(
    lodashThrottle((...args) => cbRef.current(...args), delay, { leading: true, trailing: true }),
    [delay],
  );
  useEffect(() => void (cbRef.current = cb));
  useEffect(throttledCb, [throttledCb, ...deps]);
}
