import Separator from "@components/Common/Separator";
import { UserPageContext } from "@components/UserPage";
import { BadgeContext, badgeDescriptions, badgeNames } from "@lib/badges";
import { useApi } from "@lib/hooks";
import IconButton from "@components/Common/IconButton";
import Sprite from "@components/Common/Sprite";
import Tooltip from "@components/Common/Tooltip";
import indexStyles from "./index.module.scss";
import styles from "./Badges.module.scss";

export default function UserPageBadges({ user }: UserPageContext) {
  const currentUser = useApi().currentUser;
  const badgeContext = new BadgeContext(user.id === currentUser?.id);

  return (
    <div className={indexStyles.partition}>
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
    </div>
  );
}
