import { ModPageBodyProps } from "@components/ModPage/Body";
import { useModPage } from "../redux";
import styles from "./ReleaseList.module.scss";
import clsx from "clsx";
import DownloadsList from "@components/Specialized/DownloadsList";
import { RestRelease } from "@lib/API";
import Admonition from "@components/Common/Admonition";
import { useRef, useState } from "react";

export default function ModPageReleases({ rscChangelogs }: Pick<ModPageBodyProps, "rscChangelogs">) {
  const releases = useModPage(s => s.releases);
  const mode = useModPage(s => s.mode);

  return (
    <div className={styles.wrapper}>
      {mode && (
        <Admonition type="caution" title="Concurrent editing" className="markdown">
          {"Save the changes to the mod, then you can edit the releases."}
        </Admonition>
      )}
      <div className={clsx(styles.releaseList, mode && styles.editingMod)}>
        {releases.map((release, i) => {
          return <ModPageRelease key={release.id} release={release} rscChangelog={rscChangelogs[i]} />;
        })}
      </div>
    </div>
  );
}

export interface ModPageReleaseProps {
  release: RestRelease;
  rscChangelog: React.ReactNode;
}
export function ModPageRelease({ release, rscChangelog }: ModPageReleaseProps) {
  const [height, setHeight] = useState<number | undefined>(0);
  const contentsRef = useRef<HTMLDivElement>(null);

  function toggleContents() {
    setHeight(height === 0 ? contentsRef.current?.scrollHeight || undefined : 0);
  }

  return (
    <div key={release.id} className={styles.releaseCard}>
      <div className={clsx(styles.releaseTitle, height !== 0 && styles.expanded)} onClick={toggleContents}>
        {release.title}
      </div>
      <div className={styles.releaseContents} style={{ height }} ref={contentsRef}>
        <div className={clsx("markdown concise", styles.releaseChangelog)}>{rscChangelog}</div>
        <div className={styles.filesList}>
          <label>{"Downloads"}</label>
          <DownloadsList files={release.files} release_id={release.id} />
        </div>
      </div>
    </div>
  );
}
