import { ModPageBodyProps } from "@components/ModPage/Body";
import { selectMdxConfig, useModPage, useModPageDispatch } from "../redux";
import styles from "./ReleaseList.module.scss";
import clsx from "clsx";
import { RestRelease } from "@lib/API";
import DownloadsList from "@components/Specialized/DownloadsList";
import { useEffect, useRef, useState } from "react";
import IconButton from "@components/Common/IconButton";
import { shallowEqual } from "react-redux";
import TextArea from "@components/Common/TextArea";
import { ImmerStateRecipe } from "@lib/hooks/useImmerState";
import MdxPreview from "@components/Specialized/MdxPreview";

export default function ModPageReleases({ rscChangelogs }: Pick<ModPageBodyProps, "rscChangelogs">) {
  const releases = useModPage(s => s.releases.map(r => r.id), shallowEqual);

  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.releaseList)}>
        {releases.map((release_id, i) => {
          return (
            <ModPageRelease
              key={release_id}
              release_id={release_id}
              rscChangelog={rscChangelogs[i]}
              initiallyOpen={!i}
            />
          );
        })}
      </div>
    </div>
  );
}

export interface ModPageReleaseProps {
  release_id: number;
  rscChangelog: React.ReactNode;
  initiallyOpen: boolean;
}
export function ModPageRelease({ release_id, rscChangelog, initiallyOpen }: ModPageReleaseProps) {
  const release = useModPage(s => s.releases.find(r => r.id === release_id)!);
  const original = useModPage(s => s.original_releases.find(r => r.id === release_id)!);
  const mdxConfig = useModPage(selectMdxConfig);
  const [isEditing, setIsEditing] = useState(false);

  const [height, setHeight] = useState<number | undefined>(initiallyOpen ? undefined : 0);
  const contentsRef = useRef<HTMLDivElement>(null);
  const unsetHeightTimeout = useRef<NodeJS.Timeout>();

  const dispatch = useModPageDispatch();
  const mode = useModPage(s => s.mode);

  useEffect(() => {
    if (!mode) setIsEditing(false);
  }, [mode]);

  const mutate = (mutate: ImmerStateRecipe<RestRelease>) => {
    dispatch(s => {
      mutate(s.releases.find(r => r.id === release_id)!);
    });
    setIsEditing(true);
  };

  function toggleContents() {
    if (!contentsRef.current) return;

    clearTimeout(unsetHeightTimeout.current);
    if (height === 0) {
      setHeight(contentsRef.current.scrollHeight || undefined);
      unsetHeightTimeout.current = setTimeout(() => {
        setHeight(undefined);
        unsetHeightTimeout.current = undefined;
      }, 500);
    } else {
      if (unsetHeightTimeout.current === undefined) {
        setHeight(contentsRef.current.scrollHeight);
        setTimeout(() => setHeight(0));
      } else {
        setHeight(0);
      }
    }
  }

  useEffect(() => {
    if (contentsRef.current) {
      const resize = new ResizeObserver(() => {
        console.log(contentsRef.current?.scrollHeight);
        setHeight(h => (!h ? h : contentsRef.current?.scrollHeight));
      });
      resize.observe(contentsRef.current);
      return () => resize.disconnect();
    }
  }, [contentsRef.current]);

  function toggleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    if (isEditing) {
      setIsEditing(false);
    } else {
      if (mode !== "edit") {
        dispatch(s => (s.mode = "edit"));
      }
      if (height === 0) {
        toggleContents();
      }
      setIsEditing(true);
    }
    e.stopPropagation();
  }

  return (
    <div className={styles.releaseCard}>
      <div className={clsx(styles.releaseHeader, height !== 0 && styles.expanded)} onClick={toggleContents}>
        <div className={styles.releaseTitle}>{release.title}</div>
        {mode !== "preview" && (
          <div>
            <IconButton type="edit" size={24} onClick={toggleEdit} disabled={!!mode} alpha={mode ? 0.5 : 1} />
            <IconButton type="cross" size={24} disabled={!!mode} alpha={mode ? 0.5 : 1} />
          </div>
        )}
      </div>
      <div className={styles.releaseContents} style={{ height }}>
        <div ref={contentsRef}>
          {mode === "edit" && isEditing ? (
            <TextArea
              value={release.changelog}
              minHeight="400px"
              autoTrimEnd={false}
              onChange={v => mutate(r => void (r.changelog = v))}
              error={changelog => {
                if (changelog.length > 4000) return "Changelog must not exceed 4000 characters.";
              }}
            />
          ) : release.changelog === original.changelog ? (
            <div className={clsx("markdown concise", styles.releaseChangelog)}>{rscChangelog}</div>
          ) : (
            <MdxPreview
              source={release.changelog}
              className={clsx("concise", styles.releaseChangelog)}
              config={mdxConfig}
            />
          )}
          <div className={styles.filesList}>
            <label>{"Downloads"}</label>
            <DownloadsList files={release.files} release_id={release.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
