"use client";
import { RestMod, RestRelease } from "@lib/API";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import useImmerState, { ImmerStateSetter } from "@lib/hooks/useImmerState";
import ModPageHeader from "./Header";
import ModPageBody from "@components/ModPage/Body";
import ModPageSidebar from "@components/ModPage/Sidebar";
import ModPageEditorOverlay from "@components/ModPage/EditorOverlay";
import styles from "./index.module.scss";
import diff from "@lib/utils/diff";

export interface ModPageProps {
  mod: RestMod;
  releases: RestRelease[];
  rscDescription: React.ReactNode;
}
export default function ModPage({ mod: original, releases, rscDescription }: ModPageProps) {
  const [mod, mutateMod] = useImmerState(original);
  const [mode, setMode] = useState<ModPageMode>(null);

  const context = useMemo<ModPageContext>(() => {
    const changes = diff(original, mod, {
      nugget_count: false,
      subscription_count: false,
      authors: { idBy: "user_id", user: false },
    });
    return { mod, original, mutateMod, releases, mode, setMode, changes, hasChanges: !!changes.length };
  }, [mod, releases, mode]);

  return (
    <div className={styles.container}>
      <ModPageHeader {...context} />
      <div className={styles.sides}>
        <ModPageBody {...context} rscDescription={rscDescription} />
        <ModPageSidebar {...context} />
      </div>
      <ModPageEditorOverlay {...context} />
    </div>
  );
}

export type ModPageMode = "edit" | "preview" | null;
export interface ModPageContext {
  mod: RestMod;
  original: RestMod;
  mutateMod: ImmerStateSetter<RestMod>;
  releases: RestRelease[];
  mode: ModPageMode;
  setMode: Dispatch<SetStateAction<ModPageMode>>;
  changes: string[];
  hasChanges: boolean;
}
