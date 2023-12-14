"use client";
import { ReadonlyURLSearchParams, useSearchParams as useNextSearchParams } from "next/navigation";
import { Fragment, createContext, useCallback, useContext, useLayoutEffect, useState } from "react";

// TODO: move useSearchParams to a subscription-based model

type ReactStateReturn<T> = [value: T, updateValue: React.Dispatch<React.SetStateAction<T>>];
type OverridenSearchParamsContext = ReactStateReturn<ReadonlyURLSearchParams>;
const OverridenSearchParamsContext = createContext<OverridenSearchParamsContext | null>(null);

function CustomSearchParamsProviderClient({ children }: React.PropsWithChildren) {
  const params = useNextSearchParams();
  const value = useState<ReadonlyURLSearchParams>(params);
  useLayoutEffect(() => value[1](params), [params]);
  return <OverridenSearchParamsContext.Provider value={value}>{children}</OverridenSearchParamsContext.Provider>;
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
  const overriden = useContext(OverridenSearchParamsContext);
  const value = overriden ? overriden[0] : params;

  const updateValue = useCallback(
    (update: (params: URLSearchParams) => void) => {
      if (!overriden) {
        throw new Error(CustomSearchParamsProvider.name + " is required to silently mutate search params!");
      }
      const newParams = new URLSearchParams([...value.entries()]);
      update(newParams);

      const paramsStr = newParams.toString();
      const newUrl = location.origin + location.pathname + (paramsStr ? "?" + paramsStr : "");
      window.history.replaceState(window.history.state, "", newUrl);

      overriden[1](new ReadonlyURLSearchParams(newParams));
    },
    [value, overriden],
  );

  return [value, updateValue] as const;
}
