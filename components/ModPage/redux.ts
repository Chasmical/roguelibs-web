import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, createSelector } from "@reduxjs/toolkit";
import { RestMod, RestRelease } from "@lib/API";
import { produce } from "immer";
import { diff } from "@lib/utils/diff";

export { Provider as ModPageProvider } from "react-redux";

export function createStore(mod: RestMod, releases: RestRelease[]) {
  const initialState: ModPageState = {
    mod,
    original: mod,
    releases,
    mode: null,
  };

  return configureStore<ModPageState>({
    reducer: (state, action) => {
      state ??= initialState;
      if (action.type === "mutate") {
        state = produce(state, s => {
          action.payload(s);
        });
      }
      return state;
    },
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }) as any,
  });
}

export const selectChanges = createSelector(
  (s: ModPageState) => s.original,
  (s: ModPageState) => s.mod,
  (original: RestMod, mod: RestMod) => {
    return diff(original, mod, {
      nugget_count: false,
      subscription_count: false,
      authors: { idBy: "user_id", user: false },
    });
  },
);
export const selectHasChanges = createSelector(selectChanges, changes => !!changes);

export type ModPageMode = "edit" | "preview" | null;

export interface ModPageState {
  mod: RestMod;
  original: RestMod;
  releases: RestRelease[];
  mode: ModPageMode;
}

export type ModPageStore = ReturnType<typeof createStore>;
export type ModPageDispatch = ModPageStore["dispatch"];

export const useModPage: TypedUseSelectorHook<ModPageState> = useSelector;
export const useModPageStore: () => ModPageStore = useStore;

export function useModPageDispatch(): (recipe: (state: ModPageState) => void) => void {
  const dispatch = useDispatch<ModPageDispatch>();
  return mutate => dispatch({ type: "mutate", payload: mutate });
}
