import DownloadsList from "@components/Specialized/DownloadsList";
import styles from "./index.module.scss";
import { useModPage } from "@components/ModPage";
import { RestRelease } from "@lib/API";
import AuthorsList from "@components/Specialized/AuthorsList";
import { useImmerSlice } from "@lib/hooks/useImmerState";
import clsx from "clsx";

export default function ModPageSidebar() {
  const { mod, mutateMod, releases, isEditing, hasChanges } = useModPage();
  const release: RestRelease | undefined = releases[0];

  const mutateAuthors = useImmerSlice(mutateMod, "authors");

  return (
    <div className={clsx(styles.wrapper, isEditing && styles.expanded)}>
      {release && (
        <div>
          <DownloadsList files={release.files} />
        </div>
      )}
      <div>
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
