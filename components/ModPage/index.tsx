"use client";
import { RestMod, RestRelease } from "@lib/API";
import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react";
import { ImmerStateSetter, useImmerState } from "@lib/hooks";
import ModPageHeader from "./Header";

export interface ModPageProps {
  mod: RestMod;
  releases: RestRelease[];
}
export default function ModPage({ mod: original, releases }: ModPageProps) {
  const [mod, mutateMod] = useImmerState(original);
  const [isEditing, setIsEditing] = useState(false);

  const context = useMemo<ModPageContext>(() => {
    return { mod, original, mutateMod, releases, isEditing, setIsEditing };
  }, [mod, releases]);

  return (
    <ModPageContext.Provider value={context}>
      <div>
        <ModPageHeader />
      </div>
    </ModPageContext.Provider>
  );
}

export interface ModPageContext {
  mod: RestMod;
  original: RestMod;
  mutateMod: ImmerStateSetter<RestMod>;
  releases: RestRelease[];
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const ModPageContext = createContext<ModPageContext | null>(null);

export function useModPage() {
  return useContext(ModPageContext)!;
}
