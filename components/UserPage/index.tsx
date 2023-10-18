"use client";
import UserPageAvatar from "@components/UserPage/Avatar";
import UserPageDetails from "@components/UserPage/Details";
import UserPageBadges from "@components/UserPage/Badges";
import useImmerState, { ImmerStateSetter } from "@lib/hooks/useImmerState";
import { useMemo } from "react";
import { RestUser, useApi } from "@lib/API";
import styles from "./index.module.scss";

export interface UserPageProps {
  user: RestUser;
  rscDescription: React.ReactNode;
}
export default function UserPage({ user: original, rscDescription }: UserPageProps) {
  const currentUser = useApi().currentUser;
  const [user, mutateUser] = useImmerState(original);

  const context = useMemo<UserPageContext>(() => {
    const canEdit = user.id === currentUser?.id || !!currentUser?.is_admin;
    return { user, original, mutateUser, canEdit };
  }, [user, currentUser]);

  return (
    <div className={styles.container}>
      <UserPageAvatar {...context} />
      <UserPageDetails {...context} rscDescription={rscDescription} />
      <UserPageBadges {...context} />
      <div className={styles.partition} style={{ gridColumn: "span 2" }}>Created mods</div>
      <div className={styles.partition}>Friends</div>
    </div>
  );
}

export interface UserPageContext {
  user: RestUser;
  original: RestUser;
  mutateUser: ImmerStateSetter<RestUser>;
  canEdit: boolean;
}
