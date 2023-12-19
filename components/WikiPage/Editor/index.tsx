import TextArea from "@components/Common/TextArea";
import { useWikiPage, useWikiPageDispatch } from "@components/WikiPage/redux";
import useBeforeUnload from "@lib/hooks/useBeforeUnload";
import { diff } from "@lib/utils/diff";
import styles from "./index.module.scss";

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
          if (value.length > 16000) return "Wiki page content cannot exceed 16k characters.";
        }}
      />
    </div>
  );
}
