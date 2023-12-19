import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { produce } from "immer";
import { DbWikiPage, DbWikiPageRevision } from "@lib/Database";

export { Provider as WikiPageProvider } from "react-redux";

export function createStore(page: DbWikiPage, revisions: DbWikiPageRevision[]) {
  const latest = revisions.find(r => r.is_verified)!;
  const draft: DbWikiPageRevision = { ...latest, created_at: null!, is_verified: false };

  const initialState: WikiPageState = {
    page,
    revisions: [draft, ...revisions],
  };

  return configureStore<WikiPageState>({
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

export interface WikiPageState {
  page: DbWikiPage;
  revisions: DbWikiPageRevision[];
}

export type WikiPageStore = ReturnType<typeof createStore>;
export type WikiPageDispatch = WikiPageStore["dispatch"];

export const useWikiPage: TypedUseSelectorHook<WikiPageState> = useSelector;
export const useWikiPageStore: () => WikiPageStore = useStore;

export function useWikiPageDispatch(): (recipe: (state: WikiPageState) => void) => void {
  const dispatch = useDispatch<WikiPageDispatch>();
  return mutate => dispatch({ type: "mutate", payload: mutate });
}
