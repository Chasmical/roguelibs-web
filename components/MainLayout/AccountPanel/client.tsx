"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styles from "./client.module.scss";
import Avatar from "@components/Common/Avatar";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import IconButton from "@components/Common/IconButton";
import { useSupabaseSession } from "@lib/hooks";
import Tooltip from "@components/Common/Tooltip";
import { useId } from "react";

export function SignInPanel() {
  const supabase = createClientComponentClient();
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
  const supabase = createClientComponentClient();
  const session = useSupabaseSession();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const metadata = session?.user.user_metadata;
  const name = metadata?.custom_claims?.global_name ?? metadata?.full_name;

  const badgesId = useId();

  return (
    <>
      <div className={styles.avatar}>
        <Avatar src={metadata?.avatar_url} size={72} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{name}</span>
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
