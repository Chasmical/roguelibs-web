"use client";
import { RestMod, RestRelease } from "@lib/API";
import { useState } from "react";
import styles from "./index.module.scss";
import { ModPageProvider, createStore } from "./redux";
import ModPageHeader from "./Header";
import ModPageBody from "./Body";
import ModPageSidebar from "./Sidebar";
import ModPageEditorOverlay from "./EditorOverlay";

export interface ModPageProps {
  mod: RestMod;
  releases: RestRelease[];
  rscDescription: React.ReactNode;
}
export default function ModPage({ mod: initialOriginal, releases, rscDescription }: ModPageProps) {
  const [store] = useState(() => createStore(initialOriginal, releases));

  return (
    <ModPageProvider store={store}>
      <div className={styles.container}>
        <ModPageHeader />
        <div className={styles.sides}>
          <ModPageBody rscSource={initialOriginal.description} rscDescription={rscDescription} />
          <ModPageSidebar />
        </div>
        <ModPageEditorOverlay />
      </div>
    </ModPageProvider>
  );
}
