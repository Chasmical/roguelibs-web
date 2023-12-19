import { useEffect } from "react";
import TextArea from "@components/Common/TextArea";
import { useWikiPage, useWikiPageDispatch } from "@components/WikiPage/redux";
import styles from "./index.module.scss";
import IconButton from "@components/Common/IconButton";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import useBeforeUnload from "@lib/hooks/useBeforeUnload";
import { diff } from "@lib/utils/diff";

export default function WikiPageEditor() {
  const dispatch = useWikiPageDispatch();

  const original = useWikiPage(s => s.revisions.find(r => r.created_at && r.is_verified)!);
  const draft = useWikiPage(s => s.revisions.find(r => !r.created_at)!);

  const onChange = (newContent: string) => {
    dispatch(s => {
      const d = s.revisions.find(r => !r.created_at);
      d!.content = newContent;
    });
  };

  useBeforeUnload(() => {
    const changes = diff(original, draft, {
      created_at: false,
      created_by: false,
      is_verified: false,
    });
    return !!changes;
  });

  return (
    <div className={styles.wrapper}>
      <TextArea
        value={draft.content}
        onChange={onChange}
        className="mono-font"
        minHeight="600px"
        error={value => {
          if (value.length > 16000) return "Wiki page content cannot exceed 16 000 characters.";
        }}
      />
    </div>
  );
}
