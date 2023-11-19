"use client";
import { useRouter } from "next/navigation";
import styles from "./client.module.scss";
import Avatar from "@components/Common/Avatar";
import Icon from "@components/Common/Icon";
import IconButton from "@components/Common/IconButton";
import { useSupabase } from "@lib/hooks";
import { MouseEvent, useEffect, useId, useState } from "react";
import { useApi } from "@lib/API.Hooks";
import Popup from "@components/Common/Popup";
import Separator from "@components/Common/Separator";
import clsx from "clsx";
import Tooltip from "@components/Common/Tooltip";
import { RestUserNotification } from "@lib/API";
import { formatDateLocal } from "@lib/utils/date";
import { Provider as SupabaseAuthProvider } from "@supabase/supabase-js";

export function SignInPanel() {
  const supabase = useSupabase();
  const router = useRouter();

  async function signIn(provider: SupabaseAuthProvider) {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    });
    router.refresh();
  }

  return (
    <div className={clsx(styles.panel, styles.signInPanel)}>
      <div>{"Sign In with:"}</div>
      <div>
        <IconButton type="discord" alpha={1} onClick={() => signIn("discord")} />
        <IconButton type="google" alpha={1} onClick={() => signIn("google")} />
        <IconButton type="github" alpha={1} onClick={() => signIn("github")} />
      </div>
    </div>
  );
}

export function AccountInfo() {
  const supabase = useSupabase();
  const router = useRouter();
  const user = useApi().currentUser;

  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const popupId = useId();
  const popupSelector = "#" + CSS.escape(popupId);
  const signOutId = useId();

  const accountInfoOpen = useState(false);
  const notificationsOpen = useState(false);
  const [unread, setUnread] = useState(user?.notifications.some(n => !n.is_read));

  useEffect(() => {
    if (user && !unread) {
      setUnread(user?.notifications.some(n => !n.is_read));
    }
  }, [user]);

  function toggleAccountInfo(e: MouseEvent<HTMLElement>) {
    e.stopPropagation();
    notificationsOpen[1](false);
    accountInfoOpen[1](v => !v);
  }
  function toggleNotifications(e: MouseEvent<HTMLElement>) {
    e.stopPropagation();
    accountInfoOpen[1](false);
    notificationsOpen[1](v => !v);
    setUnread(false);
  }

  return (
    <div className={styles.panel}>
      <Avatar id={popupId} src={user?.avatar_url} uid={user?.id} size={72} onClick={toggleAccountInfo} />
      <div className={styles.actions}>
        <IconButton type="options" size={16} onClick={toggleAccountInfo} />
        <IconButton onClick={toggleNotifications}>
          <Icon type="bell" alpha={unread ? 1 : 0.5} size={16} className={clsx(unread && styles.bellWiggle)} />
          {/* color={unread ? "yellow" : "white"} */}
        </IconButton>
        <IconButton
          data-tooltip-id={signOutId}
          type={signingOut ? "loading" : "door"}
          size={16}
          onClick={handleSignOut}
        />
        <Tooltip id={signOutId} place="left" content="Sign out" />
      </div>
      <Popup
        anchorSelect={popupSelector}
        open={accountInfoOpen}
        place="left"
        offset={16}
        className={styles.userPopup}
        noArrow
      >
        {() => (
          <div>
            <div className={styles.username}>{user?.username}</div>
            <Separator />
          </div>
        )}
      </Popup>
      <Popup
        anchorSelect={popupSelector}
        open={notificationsOpen}
        place="left"
        offset={16}
        className={styles.notificationPopup}
        noArrow
      >
        {() => (
          <div className={styles.notificationList}>
            <div>{"New Notifications"}</div>
            <Separator />
            {user?.notifications.map(notification => <Notification key={notification.id} value={notification} />)}
          </div>
        )}
      </Popup>
    </div>
  );
}

export interface NotificationProps {
  value: RestUserNotification;
}
export function Notification({ value }: NotificationProps) {
  return (
    <div className={styles.notification}>
      {value.message}
      <span className={styles.time}>{formatDateLocal(value.created_at)}</span>
    </div>
  );
}
