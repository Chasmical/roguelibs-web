import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { produce, Draft } from "immer";
import lodashThrottle from "lodash/throttle";

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
    [setter],
  );
}

export function useLocation(): Location | null {
  const [location, setLocation] = useState<Location | null>(null);
  useEffect(() => setLocation(window.location), []);
  return location;
}

export function useThrottle<Func extends Function>(cb: Func, dependencies: [delay: number, ...deps: DependencyList]) {
  const cbRef = useRef(cb);
  const [delay, ...deps] = dependencies;

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
