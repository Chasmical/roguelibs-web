"use client";
import { RestMod } from "@lib/API";
import styles from "./index.module.scss";
import { useState } from "react";
import ModCard from "@components/ModListPage/ModCard";

export interface ModListPageProps {
  mods: RestMod[];
}
export default function ModListPage({ mods: initialMods }: ModListPageProps) {
  const [mods, setMods] = useState(initialMods);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{"Mods"}</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.categories}></div>
        <div className={styles.list}>
          {mods.map(mod => (
            <ModCard mod={mod} key={mod.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
