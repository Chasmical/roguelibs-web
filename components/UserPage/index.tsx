"use client";
import UserPageAvatar from "@components/UserPage/Avatar";
import UserPageDetails from "@components/UserPage/Details";
import useImmerState, { ImmerStateSetter } from "@lib/hooks/useImmerState";
import { useMemo } from "react";
import { RestUser, useApi } from "@lib/API";
import styles from "./index.module.scss";

export interface UserPageProps {
  user: RestUser;
}
export default function UserPage({ user: original }: UserPageProps) {
  const currentUser = useApi().currentUser;
  const [user, mutateUser] = useImmerState(original);

  const context = useMemo<UserPageContext>(() => {
    const canEdit = user.id === currentUser?.id || !!currentUser?.is_admin;
    return { user, original, mutateUser, canEdit };
  }, [user, currentUser]);

  return (
    <div className={styles.container}>
      <UserPageAvatar {...context} />
      <UserPageDetails {...context} />
      <div />
      <div />
      <div />
    </div>
  );
}

export interface UserPageContext {
  user: RestUser;
  original: RestUser;
  mutateUser: ImmerStateSetter<RestUser>;
  canEdit: boolean;
}
