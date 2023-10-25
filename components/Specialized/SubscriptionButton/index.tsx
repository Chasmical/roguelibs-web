"use client";
import Button, { ButtonProps } from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import Tooltip from "@components/Common/Tooltip";
import { DbMod } from "@lib/Database";
import { useApi } from "@lib/hooks";
import { ImmerStateSetter } from "@lib/hooks/useImmerState";
import { arrayToggle } from "@lib/utils/misc";
import { useEffect, useId, useMemo, useState } from "react";
import { RestMod } from "@lib/API";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface SubscriptionButtonProps extends Omit<ButtonProps, "onClick"> {
  mod: DbMod;
  mutateMod?: ImmerStateSetter<RestMod>;
  iconSize?: number;
}

export default function SubscriptionButton({ mod, mutateMod, className, iconSize, ...props }: SubscriptionButtonProps) {
  const api = useApi();
  const tooltipId = useId();

  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(api.currentUser?.mod_subscriptions.includes(mod.id));

  const [subscriptionCount, setSubscriptionCount] = useState<number | null>(null);
  useMemo(() => void setSubscriptionCount(mod.subscription_count), [mod]);

  useEffect(() => {
    setSubscribed(api.currentUser?.mod_subscriptions.includes(mod.id));
  }, [api.currentUser]);

  async function toggleSubscription() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newSubscriptionCount = await api.setModSubscription(mod.id, !subscribed);
      mutateMod
        ? mutateMod(m => void (m.subscription_count = newSubscriptionCount))
        : setSubscriptionCount(newSubscriptionCount);
      arrayToggle(api.currentUser!, "mod_subscriptions", mod.id, !subscribed);
      setSubscribed(!subscribed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      data-tooltip-id={tooltipId}
      className={clsx(styles.button, subscribed && styles.set, className)}
      onClick={e => (e.preventDefault(), e.stopPropagation(), toggleSubscription())}
      {...props}
    >
      <Icon type={loading ? "loading" : "check"} alpha={loading || subscribed ? 1 : 0.5} size={iconSize} />
      {subscribed ? "Subscribed" : "Subscribe"}
      {!api.currentUser && (
        <Tooltip
          id={tooltipId}
          place="top"
          openOnClick
          variant="error"
          content="You mush sign in to subscribe to mods!"
        />
      )}
    </Button>
  );
}
