"use client";
import { useId, useRef, useState } from "react";
import TextInput from "@components/Common/TextInput";
import useThrottle from "@lib/hooks/useThrottle";
import styles from "./index.module.scss";
import Popup from "@components/Common/Popup";
import Icon from "@components/Common/Icon";
import clsx from "clsx";
import useEvent from "@lib/hooks/useEvent";
import { useRouter } from "next/navigation";
import Link from "@components/Common/Link";
import useLatest from "@lib/hooks/useLatest";
import { useApi } from "@lib/hooks";

export default function WikiSearchBar() {
  const api = useApi();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const latestQuery = useLatest(query);
  const [shown, setShown] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingRnd, setLoadingRnd] = useState(false);

  const searchBarRef = useRef<HTMLDivElement | null>(null);

  const popupId = useId();

  useThrottle(async () => {
    setWaiting(true);
    try {
      await new Promise(r => setTimeout(r, 1000));

      if (query !== latestQuery.current) return;
      setResults([
        { title: "Placeholder 1", description: "Lorem ipsum 1", page_id: 1, slug: "" },
        { title: "Placeholder 2", description: "Lorem ipsum 2", page_id: 2, slug: "" },
        { title: "Placeholder 3", description: "Lorem ipsum 3", page_id: 3, slug: "" },
      ]);
      setWaiting(false);
    } catch (error) {
      setWaiting(false);
      throw error;
    }
  }, [500, query]);

  useEvent(typeof document !== "undefined" ? document : undefined, "click", e => {
    const target = e.currentTarget as HTMLElement;
    if (!target.contains(searchBarRef.current)) {
      setShown(false);
    }
  });

  async function navigateRandom() {
    if (loadingRnd) return;
    setLoadingRnd(true);
    try {
      const slug = await api.rpc("get_random_wiki_page_slug", {});
      router.push(`/${slug}`);
    } finally {
      setTimeout(() => setLoadingRnd(false), 1000);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar} ref={searchBarRef}>
        <TextInput
          data-tooltip-id={popupId}
          value={query}
          placeholder="Search..."
          onChange={setQuery}
          onFocus={() => setShown(true)}
        />
        <Popup id={popupId} place="bottom" open={[shown, setShown]}>
          {() => (
            <div className={styles.searchResults}>
              {waiting ? (
                <div className={styles.loading}>
                  <Icon type="loading" />
                  {"Searching..."}
                </div>
              ) : (
                results.map(result => (
                  <div key={result.page_id} className={clsx(styles.searchResult, "markdown")}>
                    <h3>{result.title}</h3>
                    <div>{result.description}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </Popup>
      </div>
      <span className={styles.randomPageLink}>
        {loadingRnd && (
          <>
            <Icon type="loading" size={16} />{" "}
          </>
        )}
        <Link onClick={navigateRandom}>{"Random page"}</Link>
      </span>
    </div>
  );
}

interface SearchResult {
  page_id: number;
  slug: string;
  title: string;
  description: string;
}
