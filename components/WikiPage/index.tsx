"use client";
import { DbWikiPage, DbWikiPageRevision, DbWikiPageSlug } from "@lib/Database";
import { WikiPageProvider, createStore, useWikiPage } from "./redux";
import { Suspense, lazy, useState } from "react";
import TabItem from "@components/Common/TabItem";
import Tabs from "@components/Common/Tabs";
import Icon from "@components/Common/Icon";
import styles from "./index.module.scss";
import clsx from "clsx";

const LazyEditor = lazy(() => import("./Editor"));
const LazyHistory = lazy(() => import("./History"));

export interface WikiPageProps {
  page: DbWikiPage & { slugs: DbWikiPageSlug[]; revisions: DbWikiPageRevision[] };
  rscRevision: React.ReactNode;
}
export default function WikiPage({ page, rscRevision }: WikiPageProps) {
  const [store] = useState(() => createStore(page, page.revisions));

  return (
    <WikiPageProvider store={store}>
      <div className={styles.container}>
        <Tabs lazy>
          <TabItem label="Read">
            <ReadSection rscRevision={rscRevision} />
          </TabItem>
          <TabItem label="View source">
            {() => (
              <Suspense
                fallback={
                  <div className={styles.loading}>
                    <Icon type="loading" />
                    {"Loading code editor..."}
                  </div>
                }
              >
                <LazyEditor />
              </Suspense>
            )}
          </TabItem>
          <TabItem label="History">
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <Icon type="loading" />
                  {"Loading history..."}
                </div>
              }
            >
              <LazyHistory />
            </Suspense>
          </TabItem>
        </Tabs>
      </div>
    </WikiPageProvider>
  );
}

export interface ReadSectionProps {
  rscRevision: React.ReactNode;
}
export function ReadSection({ rscRevision }: ReadSectionProps) {
  const revision = useWikiPage(s => s.revisions.find(r => r.is_verified)!);

  return (
    <>
      {/* {hasChanges && <Admonition type="caution">{"You have unsaved changes!"}</Admonition>} */}
      <div className={clsx(styles.content, "markdown")}>
        <h1>{revision.title}</h1>
        {rscRevision}
      </div>
    </>
  );
}
