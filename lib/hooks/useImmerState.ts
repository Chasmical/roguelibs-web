"use client";
import { useMemo, useReducer } from "react";
import { produce, type Draft } from "immer";

export type ImmerStateRecipe<T> = (draft: Draft<T>) => T | void;
export type ImmerStateSetter<T> = (recipe: ImmerStateRecipe<T>) => void;
export type ImmerStateReducer<T> = (current: T, recipe: ImmerStateRecipe<T>) => T;

function init<T>(initialState: T | (() => T)): T {
  return typeof initialState === "function" ? (initialState as () => T)() : initialState;
}

export default function useImmerState<T>(initialState: T | (() => T)): [state: T, dispatch: ImmerStateSetter<T>] {
  return useReducer(produce as ImmerStateReducer<T>, initialState, init);
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
