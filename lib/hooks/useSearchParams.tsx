"use client";
import { ReadonlyURLSearchParams, useSearchParams as useNextSearchParams } from "next/navigation";
import { Fragment, createContext, useCallback, useContext, useLayoutEffect, useState } from "react";

// TODO: move useSearchParams to a subscription-based model

type ReactStateReturn<T> = [value: T, updateValue: React.Dispatch<React.SetStateAction<T>>];
type OverrideSearchParamsContext = ReactStateReturn<ReadonlyURLSearchParams>;
const OverrideSearchParamsContext = createContext<OverrideSearchParamsContext | null>(null);

function CustomSearchParamsProviderClient({ children }: React.PropsWithChildren) {
  const params = useNextSearchParams();
  const value = useState<ReadonlyURLSearchParams>(params);
  useLayoutEffect(() => value[1](params), [params]);
  return <OverrideSearchParamsContext.Provider value={value}>{children}</OverrideSearchParamsContext.Provider>;
}

// prevents Next from thinking that the entire tree should be client-rendered
export const CustomSearchParamsProvider = typeof window === "undefined" ? Fragment : CustomSearchParamsProviderClient;

// Using Next's router creates a new page request on every change,
// while using just window.history prevents useSearchParams from updating.
// This solution basically breaks useSearchParams, but still allows this
// specific hook to work properly, by using its own context.

// Related discussion: https://github.com/vercel/next.js/discussions/47583

export default function useSearchParams() {
  const params = useNextSearchParams();
  const override = useContext(OverrideSearchParamsContext);
  const value = override ? override[0] : params;

  const updateValue = useCallback(
    (update: (params: URLSearchParams) => void) => {
      if (!override) {
        throw new Error(CustomSearchParamsProvider.name + " is required to silently mutate search params!");
      }
      const newParams = new URLSearchParams([...value.entries()]);
      update(newParams);

      const paramsStr = newParams.toString();
      const newUrl = location.origin + location.pathname + (paramsStr ? "?" + paramsStr : "") + location.hash;
      window.history.replaceState(window.history.state, "", newUrl);

      override[1](new ReadonlyURLSearchParams(newParams));
    },
    [value, override],
  );

  return [value, updateValue] as const;
}
