import { UserPageContext } from "@components/UserPage";
import styles from "./Avatar.module.scss";
import Avatar from "@components/Common/Avatar";
import IconButton from "@components/Common/IconButton";
import Tooltip from "@components/Common/Tooltip";

export default function UserPageAvatar({ user, canEdit }: UserPageContext) {
  return (
    <div className={styles.wrapper}>
      <Avatar src={user.avatar_url} size="100%">
        {canEdit && (
          <IconButton
            data-tooltip-id="upload-avatar"
            type="upload"
            size={64}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Avatar>
      {canEdit && <Tooltip id="upload-avatar" content="Upload avatar" place="bottom" />}
    </div>
  );
}
