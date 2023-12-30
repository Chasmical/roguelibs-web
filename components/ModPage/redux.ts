import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, createSelector } from "@reduxjs/toolkit";
import { RestMod, RestRelease } from "@lib/API";
import { produce } from "immer";
import { diff } from "@lib/utils/diff";
import { MdxPreviewProps } from "@components/Specialized/MdxPreview";

export { Provider as ModPageProvider } from "react-redux";

export function createStore(mod: RestMod, releases: RestRelease[]) {
  const initialState: ModPageState = {
    mod,
    original: mod,
    releases,
    original_releases: releases,
    mode: null,
  };

  return configureStore<ModPageState>({
    reducer: (state, action) => {
      state ??= initialState;
      if (action.type === "mutate") {
        state = produce(state, s => {
          (action.payload as any)(s);
        });
      }
      return state;
    },
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }) as any,
  });
}

export const selectModChanges = createSelector(
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
export const selectReleaseChanges = createSelector(
  (s: ModPageState) => s.original_releases,
  (s: ModPageState) => s.releases,
  (originals: RestRelease[], releases: RestRelease[]) => {
    const diffs = releases.map(release => {
      const original = originals.find(o => o.id === release.id)!;
      return diff(original, release, {
        files: false,
      });
    });
    return diffs.some(Boolean) ? diffs : undefined;
  },
);
export const selectHasChanges = createSelector(selectModChanges, selectReleaseChanges, (a, b) => !!a || !!b);

export const selectMdxConfig = createSelector(
  (s: ModPageState) => s.mod.github_repo,
  (github_repo: string | null): MdxPreviewProps["config"] => {
    return { gitHubRepo: github_repo };
  },
);

export type ModPageMode = "edit" | "preview" | null;

export interface ModPageState {
  mod: RestMod;
  original: RestMod;
  releases: RestRelease[];
  original_releases: RestRelease[];
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
