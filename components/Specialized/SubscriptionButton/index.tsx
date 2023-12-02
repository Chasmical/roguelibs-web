"use client";
import Button, { ButtonProps } from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import Tooltip from "@components/Common/Tooltip";
import { useApi } from "@lib/hooks";
import { arrayToggle } from "@lib/utils/misc";
import { useEffect, useId, useState } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface SubscriptionButtonProps extends Omit<ButtonProps, "onClick" | "onChange"> {
  mod_id: number;
  onChange?: (newValue: number) => void;
  iconSize?: number;
}

export default function SubscriptionButton({
  mod_id,
  onChange,
  className,
  iconSize,
  ["data-tooltip-id"]: providedTooltipId,
  ...props
}: SubscriptionButtonProps) {
  const api = useApi();
  const ownTooltipId = useId();
  const tooltipId = providedTooltipId ?? ownTooltipId;

  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(api.currentUser?.mod_subscriptions.includes(mod_id));

  useEffect(() => {
    setSubscribed(api.currentUser?.mod_subscriptions.includes(mod_id));
  }, [api.currentUser]);

  async function toggleSubscription() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newSubscriptionCount = await api.setModSubscription(mod_id, !subscribed);
      onChange?.(newSubscriptionCount);
      arrayToggle(api.currentUser!, "mod_subscriptions", mod_id, !subscribed);
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
      data-tooltip-content="You must sign in to subscribe to mods!"
      className={clsx(styles.button, subscribed && styles.set, className)}
      onClick={e => (e.preventDefault(), e.stopPropagation(), toggleSubscription())}
      {...props}
    >
      <Icon type={loading ? "loading" : "check"} alpha={loading || subscribed ? 1 : 0.5} size={iconSize} />
      {subscribed ? "Subscribed" : "Subscribe"}
      {!api.currentUser && !providedTooltipId && (
        <Tooltip id={tooltipId} place="top" openOnClick variant="error" content="" delayHide={-1} />
      )}
    </Button>
  );
}
