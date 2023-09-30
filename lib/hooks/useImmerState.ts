"use client";
import { useCallback, useMemo, useState } from "react";
import { produce, type Draft } from "immer";

export type ImmerStateRecipe<T> = (draft: Draft<T>) => T | undefined;
export type ImmerStateSetter<T> = (recipe: ImmerStateRecipe<T>) => void;

export default function useImmerState<T>(defaultState: T | (() => T)) {
  const [state, setState] = useState<T>(defaultState);

  const mutateState = useCallback((recipe: (draft: Draft<T>) => void) => {
    setState(current => produce(current, recipe));
  }, []);

  return [state, mutateState] as [T, ImmerStateSetter<T>];
}

export function useImmerSlice<T, Key extends keyof T>(
  setter: ImmerStateSetter<T> | undefined,
  key: Key,
): ImmerStateSetter<T[Key]> | undefined;
export function useImmerSlice<T, Key extends keyof T>(setter: ImmerStateSetter<T>, key: Key): ImmerStateSetter<T[Key]>;
export function useImmerSlice<T, Key extends keyof T>(
  setter: ImmerStateSetter<T> | undefined,
  key: Key,
): ImmerStateSetter<T[Key]> | undefined {
  return useMemo(() => {
    if (!setter) return setter;
    return subRecipe =>
      setter(objDraft => {
        const valueDraft = (objDraft as T)[key] as Draft<T[Key]>;
        const recipeResult = subRecipe(valueDraft);
        if (recipeResult !== undefined) {
          (objDraft as T)[key] = recipeResult;
        }
        return void 0;
      });
  }, [setter, key]);
}
