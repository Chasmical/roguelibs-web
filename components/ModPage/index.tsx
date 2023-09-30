"use client";
import { RestMod, RestRelease } from "@lib/API";
import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react";
import useImmerState, { ImmerStateSetter } from "@lib/hooks/useImmerState";
import ModPageHeader from "./Header";
import ModPageBody from "@components/ModPage/Body";
import ModPageSidebar from "@components/ModPage/Sidebar";
import styles from "./index.module.scss";
import diff from "@lib/utils/diff";

export interface ModPageProps {
  mod: RestMod;
  releases: RestRelease[];
  rscDescription: React.ReactNode;
}
export default function ModPage({ mod: original, releases, rscDescription }: ModPageProps) {
  const [mod, mutateMod] = useImmerState(original);
  const [isEditing, setIsEditing] = useState(false);

  const context = useMemo<ModPageContext>(() => {
    const changes = diff(original, mod, {
      nugget_count: false,
      authors: { idBy: "user_id", user: false },
    });
    return { mod, original, mutateMod, releases, isEditing, setIsEditing, hasChanges: !!changes.length };
  }, [mod, releases, isEditing]);

  return (
    <ModPageContext.Provider value={context}>
      <div className={styles.container}>
        <ModPageHeader {...context} />
        <div className={styles.sides}>
          <ModPageBody {...context} rscDescription={rscDescription} />
          <ModPageSidebar {...context} />
        </div>
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
  hasChanges: boolean;
}

const ModPageContext = createContext<ModPageContext | null>(null);

export function useModPage() {
  return useContext(ModPageContext)!;
}
