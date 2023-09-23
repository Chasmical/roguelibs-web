import { useCallback } from "react";

export default function useMergedRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useCallback<React.RefCallback<T>>(value => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  }, refs);
}
