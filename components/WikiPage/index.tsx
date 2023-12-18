"use client";
import { DbWikiPage, DbWikiPageRevision, DbWikiPageSlug } from "@lib/Database";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface WikiPageProps {
  page: DbWikiPage & { slugs: DbWikiPageSlug[]; revisions: DbWikiPageRevision[] };
  rscRevision: React.ReactNode;
}
export default function WikiPage({ page, rscRevision }: WikiPageProps) {
  const revision = page.revisions[0];

  return (
    <div className={styles.container}>
      <div className={clsx(styles.content, "markdown")}>
        <h1>{revision.title}</h1>
        {rscRevision}
      </div>
    </div>
  );
}
