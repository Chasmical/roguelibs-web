import { useApi } from "@lib/API";
import { DbUser, UserSearchResult } from "@lib/Database";
import { useId, useState } from "react";
import styles from "./index.module.scss";
import Popup, { PopupProps } from "@components/Common/Popup";
import useThrottle from "@lib/hooks/useThrottle";
import Button from "@components/Common/Button";
import TextInput from "@components/Common/TextInput";
import Separator from "@components/Common/Separator";
import Avatar from "@components/Common/Avatar";
import clsx from "clsx";

export interface UserSearchProps extends Omit<PopupProps, "id" | "open" | "render" | "children"> {
  term: [string, (newTerm: string) => void];
  className?: string;
  disabled?: (user: DbUser) => boolean;
  onClick?: (user: DbUser) => void;
  children?: React.ReactNode;
}

export default function UserSearch({
  className,
  term: [term, setTerm],
  disabled,
  onClick,
  children,
  ...popupProps
}: UserSearchProps) {
  const api = useApi();

  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResultTerm, setSearchResultTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  useThrottle(() => {
    const ac = new AbortController();

    if (term.trim()) {
      (async () => {
        try {
          setSearching(true);
          const data = await api.searchUsers(term.trim(), 4, ac.signal);
          setSearchResults(data);
          setSearchResultTerm(term);
        } catch (err) {
        } finally {
          setSearching(false);
        }
      })();
    } else {
      setSearchResults([]);
    }

    return () => ac.abort();
  }, [500, term]);

  function openSearch() {
    if (isOpen) return;
    setTerm("");
    setIsOpen(true);
  }
  function selectUser(user: DbUser) {
    setIsOpen(false);
    onClick?.(user);
  }

  return (
    <>
      <Button data-tooltip-id={id} className={clsx(styles.button, className)} onClick={openSearch}>
        {children}
      </Button>
      <Popup
        id={id}
        place="left"
        open={[isOpen, setIsOpen]}
        render={() => (
          <div className={styles.search}>
            <TextInput value={term} onChange={setTerm} />
            <Separator bold />
            <div className={styles.results}>
              {term.length === 0 ? (
                <span className={styles.label}>{"Start searching!"}</span>
              ) : searching || term != searchResultTerm ? (
                <span className={styles.label}>{"Searching..."}</span>
              ) : searchResults.length === 0 ? (
                <span className={styles.label}>{"No results :("}</span>
              ) : (
                searchResults.map(user => (
                  <Button
                    key={user.id}
                    className={styles.result}
                    disabled={disabled?.(user)}
                    onClick={() => selectUser(user)}
                  >
                    <Avatar src={user.avatar_url} size={32} />
                    {user.username}
                  </Button>
                ))
              )}
            </div>
          </div>
        )}
        {...popupProps}
      />
    </>
  );
}
