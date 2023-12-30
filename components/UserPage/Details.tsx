import { RestUser } from "@lib/API";
import { useMemo, useState } from "react";
import { UserPageContext } from "@components/UserPage";
import Popup from "@components/Common/Popup";
import IconButton from "@components/Common/IconButton";
import TextInput from "@components/Common/TextInput";
import indexStyles from "./index.module.scss";
import styles from "./Details.module.scss";
import TextArea from "@components/Common/TextArea";
import MdxPreview, { MdxPreviewProps } from "@components/Specialized/MdxPreview";

export default function UserPageDetails(context: DescriptionSectionProps) {
  return (
    <div className={styles.wrapper}>
      <UsernameSection {...context} />
      <DescriptionSection {...context} />
    </div>
  );
}

export function UsernameSection({ user, original, mutateUser, canEdit }: UserPageContext) {
  const [prevUsername, setPrevUsername] = useState(original.username);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  function editUsername(e: React.MouseEvent) {
    setIsEditing(true);
    e.stopPropagation();
  }
  function resetUsername() {
    setIsEditing(false);
    mutateUser(u => void (u.username = prevUsername));
  }
  async function saveUsername() {
    if (loading || user.username.length < 1 || user.username.length > 64) return;
    try {
      setLoading(true);

      const diff = { id: user.id, username: user.username };
      const response = await fetch(`${location.origin}/api/update_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diff),
      });
      const newUser = (await response.json()) as RestUser;

      setPrevUsername(newUser.username);
      mutateUser(r => Object.assign(r, newUser));
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={indexStyles.partition}>
      <div className={styles.usernameContainer} data-tooltip-id="username">
        <div className={styles.username}>{user.username}</div>
        {canEdit && !isEditing && <IconButton type="edit" size={16} onClick={editUsername} />}
      </div>

      <Popup id="username" place="bottom" open={[isEditing, resetUsername]}>
        {() => (
          <div className={styles.usernameInput}>
            <TextInput
              value={user.username}
              onChange={v => mutateUser(u => void (u.username = v))}
              error={username => {
                if (username.length < 1) return "The username must not be empty.";
                if (username.length > 64) return `Exceeded length limit (${username.length}/64).`;
                return null;
              }}
            />
            <IconButton
              type={loading ? "loading" : "save"}
              size={32}
              disabled={loading || user.username === original.username}
              onClick={saveUsername}
            />
          </div>
        )}
      </Popup>
    </div>
  );
}

export interface DescriptionSectionProps extends UserPageContext {
  rscDescription: React.ReactNode;
}

export function DescriptionSection({ user, original, mutateUser, canEdit, rscDescription }: DescriptionSectionProps) {
  const [rscSource] = useState(original.description);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function saveDescription() {
    if (loading || user.description.length > 400) return;
    try {
      setLoading(true);

      const diff = { id: user.id, description: user.description };
      const response = await fetch(`${location.origin}/api/update_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diff),
      });
      const newUser = (await response.json()) as RestUser;

      mutateUser(u => Object.assign(u, newUser));
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const mdxConfig = useMemo<MdxPreviewProps["config"]>(() => ({}), []);

  return (
    <div className={indexStyles.partition}>
      {isEditing ? (
        <TextArea
          value={user.description}
          onChange={d => mutateUser(u => void (u.description = d))}
          error={description => {
            if (description.length > 400) return `Exceeded length limit (${description.length}/400).`;
            return null;
          }}
        />
      ) : user.description === rscSource ? (
        <div className="markdown">{rscDescription}</div>
      ) : (
        <MdxPreview source={user.description} config={mdxConfig} />
      )}
    </div>
  );
}
