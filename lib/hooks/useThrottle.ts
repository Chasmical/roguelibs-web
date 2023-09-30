import { useEffect, useMemo, useRef } from "react";
import lodashThrottle from "lodash/throttle";

export default function useThrottle<Func extends Function>(
  cb: Func,
  [delay, ...deps]: [number, ...React.DependencyList],
) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const throttledCb = useMemo(() => {
    return lodashThrottle((...args) => cbRef.current(...args), delay, { leading: true, trailing: true });
  }, [delay]);

  useEffect(() => {
    throttledCb.cancel();
    throttledCb();
  }, [throttledCb, ...deps]);
}
