import { useCallback } from "react";
import useSearchParams from "@lib/hooks/useSearchParams";

export default function useQueryString(key: string | null | undefined) {
  const [params, updateParams] = useSearchParams();
  const value = key ? params.get(key) : undefined;

  const setValue = useCallback(
    (newValue: string | null | undefined) => {
      if (key) {
        updateParams(params => {
          newValue != null ? params.set(key, newValue) : params.delete(key);
        });
      }
    },
    [key, params],
  );

  return [value, setValue] as const;
}
