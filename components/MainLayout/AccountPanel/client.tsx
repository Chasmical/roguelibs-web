"use client";
import { useRouter } from "next/navigation";
import styles from "./client.module.scss";
import Avatar from "@components/Common/Avatar";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import IconButton from "@components/Common/IconButton";
import { useSupabase } from "@lib/hooks";
import { MouseEvent, useId, useState } from "react";
import { useApi } from "@lib/API.Hooks";
import Popup from "@components/Common/Popup";
import Separator from "@components/Common/Separator";
import clsx from "clsx";
import Tooltip from "@components/Common/Tooltip";

export function SignInPanel() {
  const supabase = useSupabase();
  const router = useRouter();

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    router.refresh();
  }

  return (
    <div className={styles.panel}>
      <Button onClick={handleSignIn}>
        <Icon type="discord" />
        {"Sign In"}
      </Button>
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
  const signOutId = useId();

  const accountInfoOpen = useState(false);
  const notificationsOpen = useState(false);
  const [unread, setUnread] = useState(true);

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
      <Avatar data-tooltip-id={popupId} src={user?.avatar_url} uid={user?.id} size={72} onClick={toggleAccountInfo} />
      <div className={styles.actions}>
        <IconButton type="options" size={16} onClick={toggleAccountInfo} />
        <IconButton onClick={toggleNotifications}>
          <Icon
            type="bell"
            color={unread ? "yellow" : "white"}
            alpha={unread ? 1 : 0.5}
            size={16}
            className={clsx(unread && styles.bellWiggle)}
          />
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
        id={popupId}
        open={accountInfoOpen}
        place="left"
        offset={16}
        className={clsx(styles.popup, styles.accountInfo)}
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
        id={popupId}
        open={notificationsOpen}
        place="left"
        offset={16}
        className={clsx(styles.popup, styles.notifications)}
        noArrow
      >
        {() => (
          <div>
            <div>{"New Notifications"}</div>
            <Separator />
          </div>
        )}
      </Popup>
    </div>
  );
}
