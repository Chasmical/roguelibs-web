"use client";
import { useRouter } from "next/navigation";
import styles from "./client.module.scss";
import Avatar from "@components/Common/Avatar";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import IconButton from "@components/Common/IconButton";
import { useSupabase } from "@lib/hooks";
import Tooltip from "@components/Common/Tooltip";
import { useId } from "react";
import { useApi } from "@lib/API.Hooks";

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
    <div>
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const badgesId = useId();

  return (
    <>
      <div className={styles.avatar}>
        <Avatar src={user?.avatar_url} uid={user?.id} size={72} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{user?.username}</span>
        <div className={styles.badges}>
          {Array.from({ length: 15 }).map((_, i) => (
            <Icon key={i} type="nugget" size={24} />
          ))}
          <Icon data-tooltip-id={badgesId} type="add" size={16} style={{ alignSelf: "center", margin: "0 auto" }} />
          <Tooltip id={badgesId} place="bottom">
            {"24 more"}
          </Tooltip>
        </div>
      </div>
      <div className={styles.accountActions}>
        <IconButton type="edit" size={16} onClick={handleSignOut} />
        <IconButton type="door" size={16} onClick={handleSignOut} />
      </div>
    </>
  );
}
