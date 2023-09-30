"use client";
import DownloadsList from "@components/Specialized/DownloadsList";
import styles from "./index.module.scss";
import { ModPageContext } from "@components/ModPage";
import AuthorsList from "@components/Specialized/AuthorsList";
import useImmerState, { useImmerSlice } from "@lib/hooks/useImmerState";
import Separator from "@components/Common/Separator";
import clsx from "clsx";

export default function ModPageSidebar(props: ModPageContext) {
  const { mod, mutateMod, releases, isEditing, hasChanges } = props;

  const mutateAuthors = useImmerSlice(mutateMod, "authors");

  // TODO: this is just a placeholder for testing the downloads list
  const [release, mutateRelease] = useImmerState(releases[0]);
  const mutateFiles = useImmerSlice(mutateRelease, "files");

  return (
    <div className={clsx(styles.wrapper, isEditing && styles.expanded)}>
      {release && (
        <>
          <div className={styles.section}>
            <label>{"Latest download" + (release.files.length > 1 ? "s" : "")}</label>
            <DownloadsList
              files={release.files}
              mutateFiles={isEditing ? mutateFiles : undefined}
              isEditing={isEditing}
              hasChanges={hasChanges}
            />
          </div>
          <Separator outset="1rem" />
        </>
      )}
      <div className={styles.section}>
        <label>{"Author" + (mod.authors.length > 1 ? "s" : "")}</label>
        <AuthorsList
          authors={mod.authors}
          mutateAuthors={isEditing ? mutateAuthors : undefined}
          isEditing={isEditing}
          hasChanges={hasChanges}
        />
      </div>
    </div>
  );
}
