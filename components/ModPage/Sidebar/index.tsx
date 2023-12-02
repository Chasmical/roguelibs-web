"use client";
import DownloadsList from "@components/Specialized/DownloadsList";
import styles from "./index.module.scss";
import AuthorsList from "@components/Specialized/AuthorsList";
import { ImmerStateSetter } from "@lib/hooks/useImmerState";
import GitHubButton from "@components/Specialized/ExternalLinkButton/github";
import GameBananaButton from "@components/Specialized/ExternalLinkButton/gamebanana";
import WebsiteLinkButton from "@components/Specialized/ExternalLinkButton/website";
import { useModPage, useModPageDispatch } from "../redux";
import { RestModAuthor, RestReleaseFile } from "@lib/API";
import { produce } from "immer";
import clsx from "clsx";

export default function ModPageSidebar() {
  const mode = useModPage(s => s.mode);

  return (
    <div className={clsx(styles.wrapper, mode === "edit" && styles.expanded)}>
      <ModDownloads />
      <ModAuthors />
      <ModExternals />
    </div>
  );
}

// TODO: this is just a placeholder for testing the downloads list
function ModDownloads() {
  const dispatch = useModPageDispatch();
  const mode = useModPage(s => s.mode);
  const release = useModPage(s => s.releases[0]);

  const mutateFiles: ImmerStateSetter<RestReleaseFile[]> = recipe =>
    dispatch(s => {
      const release = s.releases[0];
      release.files = produce(release.files, recipe);
    });

  if (!release) return null;

  return (
    <div className={styles.section}>
      <label>{"Latest download" + (release.files.length !== 1 ? "s" : "")}</label>
      <DownloadsList
        files={release.files}
        mutateFiles={mutateFiles}
        isEditing={mode === "edit"}
        linkTargetBlank={!!mode}
        release_id={release.id}
      />
    </div>
  );
}
function ModAuthors() {
  const dispatch = useModPageDispatch();
  const mode = useModPage(s => s.mode);
  const mod_id = useModPage(s => s.mod.id);
  const authors = useModPage(s => s.mod.authors);

  const mutateAuthors: ImmerStateSetter<RestModAuthor[]> = recipe =>
    dispatch(s => {
      s.mod.authors = produce(s.mod.authors, recipe);
    });

  return (
    <div className={styles.section}>
      <label>{"Author" + (authors.length !== 1 ? "s" : "")}</label>
      <AuthorsList
        authors={authors}
        mutateAuthors={mutateAuthors}
        isEditing={mode === "edit"}
        linkTargetBlank={!!mode}
        mod_id={mod_id}
      />
    </div>
  );
}
function ModExternals() {
  const github_repo = useModPage(s => s.mod.github_repo);
  const gamebanana_id = useModPage(s => s.mod.gamebanana_id);
  const website_link = useModPage(s => s.mod.website_link);

  return (
    <div className={styles.section}>
      <label>{"External links"}</label>
      {github_repo && <GitHubButton repo={github_repo} />}
      {gamebanana_id && <GameBananaButton id={gamebanana_id} />}
      {website_link && <WebsiteLinkButton href={website_link} />}
    </div>
  );
}
