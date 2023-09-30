import DownloadsList from "@components/Specialized/DownloadsList";
import styles from "./index.module.scss";
import { useModPage } from "@components/ModPage";
import { RestRelease } from "@lib/API";
import AuthorsList from "@components/Specialized/AuthorsList";
import useImmerState, { useImmerSlice } from "@lib/hooks/useImmerState";
import Separator from "@components/Common/Separator";
import clsx from "clsx";

export default function ModPageSidebar() {
  const { mod, mutateMod, releases, isEditing, hasChanges } = useModPage();
  // const release: RestRelease | undefined = releases[0];

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
              mutateFiles={mutateFiles}
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
          mutateAuthors={mutateAuthors}
          isEditing={isEditing}
          hasChanges={hasChanges}
        />
      </div>
    </div>
  );
}
