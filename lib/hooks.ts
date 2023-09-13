import { DependencyList, Dispatch, Ref, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { produce, Draft } from "immer";
import lodashThrottle from "lodash/throttle";

export { useSession as useSupabaseSession, useSupabaseClient as useSupabase } from "@supabase/auth-helpers-react";
export { useApi } from "./API.Hooks";

export type ImmerStateRecipe<T> = (draft: Draft<T>) => T | undefined;
export type ImmerStateSetter<T> = (recipe: ImmerStateRecipe<T>) => void;

export function useImmerState<T>(defaultState: T | (() => T)) {
  const [state, setState] = useState<T>(defaultState);

  const mutateState = useCallback((recipe: (draft: Draft<T>) => void) => {
    setState(current => produce(current, recipe));
  }, []);

  return [state, mutateState] as [T, ImmerStateSetter<T>];
}

export function useImmerSlice<T, Key extends keyof T>(setter: ImmerStateSetter<T>, key: Key): ImmerStateSetter<T[Key]> {
  return useCallback(
    subRecipe =>
      setter(objDraft => {
        const valueDraft = (objDraft as T)[key] as Draft<T[Key]>;
        const recipeResult = subRecipe(valueDraft);
        if (recipeResult !== undefined) {
          (objDraft as T)[key] = recipeResult;
        }
        return void 0;
      }),
    [setter, key],
  );
}

export function useLocation(): Location | null {
  const [location, setLocation] = useState<Location | null>(null);
  useEffect(() => setLocation(window.location), []);
  return location;
}

export function useThrottle<Func extends Function>(cb: Func, [delay, ...deps]: [number, ...DependencyList]) {
  const cbRef = useRef(cb);

  const throttledCb = useCallback(
    lodashThrottle((...args) => cbRef.current(...args), delay, { leading: true, trailing: true }),
    [delay],
  );
  useEffect(() => void (cbRef.current = cb));
  useEffect(throttledCb, [throttledCb, ...deps]);
}

// eslint-disable-next-line no-undef
type EventMap = DocumentEventMap;

export function useEvent<K extends keyof EventMap>(
  element: Document,
  eventName: K,
  handler: (event: EventMap[K]) => void,
  dependencies: DependencyList,
) {
  const handlerRef = useRef<((event: EventMap[K]) => void) | null>(null);

  useEffect(() => void (handlerRef.current = handler), dependencies);

  useEffect(() => {
    const listener = (e: EventMap[K]) => handlerRef.current?.(e);

    element.addEventListener(eventName, listener);
    return () => element.removeEventListener(eventName, listener);
  }, [element, eventName]);
}

export function useMergedRefs<T>(...refs: Ref<T>[]): React.RefCallback<T> {
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

export function useLocalStorage(
  key: string,
  defaultValue: string | null | undefined,
): [value: string | null | undefined, setValue: Dispatch<SetStateAction<string | null | undefined>>] {
  const ref = useRef<LocalStorageRef>();
  const [state, setState] = useState(defaultValue);
  ref.current = { key, state };

  const setValue = useCallback<Dispatch<SetStateAction<string | null | undefined>>>(e => {
    if (ref.current!.state === undefined) return;
    setState(prev => {
      if (prev === undefined) return prev;
      const newValue = (typeof e === "function" ? e(prev) : e) ?? null;
      newValue !== null ? localStorage.setItem(ref.current!.key, newValue) : localStorage.removeItem(ref.current!.key);
      return newValue;
    });
  }, []);

  useEffect(() => {
    setState(window.localStorage.getItem(key) ?? null);
  }, [key]);

  return [state, setValue];
}

interface LocalStorageRef {
  key: string;
  state: string | null | undefined;
}
