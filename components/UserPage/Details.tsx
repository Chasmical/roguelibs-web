import { RestUser, useApi } from "@lib/API";
import { useState } from "react";
import styles from "./Details.module.scss";
import Separator from "@components/Common/Separator";
import { UserPageContext } from "@components/UserPage";
import Popup from "@components/Common/Popup";
import IconButton from "@components/Common/IconButton";
import TextInput from "@components/Common/TextInput";
import { BadgeContext, badgeDescriptions, badgeNames } from "@lib/badges";
import Sprite from "@components/Common/Sprite";
import Tooltip from "@components/Common/Tooltip";

export default function UserPageDetails(context: UserPageContext) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <UsernameSection {...context} />
      </div>
      <div className={styles.section}>
        <BadgesSection {...context} />
      </div>
      <div className={styles.section}>
        <MiscellaneousSection />
      </div>
    </div>
  );
}

function UsernameSection({ user, original, mutateUser, canEdit }: UserPageContext) {
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
    <>
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
              error={(() => {
                if (user.username.length < 1) return "The username must not be empty.";
                if (user.username.length > 64) return "The username must not exceed 64 characters.";
                return null;
              })()}
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
    </>
  );
}

function BadgesSection({ user }: UserPageContext) {
  const currentUser = useApi().currentUser;
  const badgeContext = new BadgeContext(user.id === currentUser?.id);

  return (
    <>
      <label>{"Badges"}</label>
      <Separator />
      <div className={styles.badgesContainer}>
        {user.badges?.map(badge_name => {
          return (
            <div key={badge_name}>
              <IconButton data-tooltip-id={badge_name} disabled="fake">
                <Sprite src={`/badges/${badge_name}.png`} size={32} alpha={1} crisp />
              </IconButton>
              <Tooltip id={badge_name} delayShow={100} place="bottom">
                {() => (
                  <div className={styles.badgeInfo}>
                    <span className={styles.badgeTitle}>{badgeNames[badge_name]?.()}</span>
                    <Separator primary />
                    <Sprite src={`/badges/${badge_name}.png`} size={128} alpha={1} crisp />
                    <Separator primary />
                    <div className={styles.badgeDescription}>{badgeDescriptions[badge_name]?.(badgeContext)}</div>
                  </div>
                )}
              </Tooltip>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MiscellaneousSection() {
  return (
    <>
      <label>{"Miscellaneous"}</label>
    </>
  );
}
