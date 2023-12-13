"use client";
import { HTMLProps, useEffect, useState } from "react";
import useEvent from "@lib/hooks/useEvent";
import { useApi } from "@lib/hooks";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface MdxPreviewProps extends HTMLProps<HTMLDivElement> {
  source: string;
  is_verified?: boolean;
  className?: string;
  onLoad?: () => void;
  // ...props
  style?: React.CSSProperties;
}
export default function MdxPreview({ source, is_verified, className, onLoad, ...props }: MdxPreviewProps) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  async function updateMdxPreview() {
    try {
      setLoading(true);
      setUid(await api.upsertMdxPreview(source, is_verified ?? false));
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading) {
      return console.warn(
        "MdxPreview's source should not be changed frequently! Rate-limit that in the parent component!",
      );
    }
    updateMdxPreview();
  }, [source, is_verified ?? false]);

  useEvent(window, "message", event => {
    if (event.data?.type !== "iframeHeight") return;
    let prev = false;
    setLoading(v => ((prev = v), false));
    prev && onLoad?.();
    setHeight(event.data.height);
  });

  return (
    <div className={clsx(styles.wrapper, className)} {...props}>
      {uid ? (
        <iframe className={styles.iframe} src={`/mdx-preview/${uid}`} height={height ?? 300} />
      ) : (
        <div>{"Loading..."}</div>
      )}
    </div>
  );
}
