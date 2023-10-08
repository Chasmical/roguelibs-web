"use client";
import { ModPageContext } from "@components/ModPage";
import styles from "./RightButtons.module.scss";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import clsx from "clsx";
import { useEffect, useId, useState } from "react";
import Popup from "@components/Common/Popup";
import { useApi } from "@lib/API.Hooks";
import Tooltip from "@components/Common/Tooltip";
import { arrayToggle } from "@lib/utils/misc";

export default function ModPageRightButtons(props: ModPageContext) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <NuggetButton {...props} />
        <SubscriptionButton {...props} />
        <MiscButton {...props} />
      </div>
    </div>
  );
}

export function NuggetButton(props: ModPageContext) {
  const { mod, mutateMod } = props;
  const api = useApi();
  const tooltipId = useId();

  const [loading, setLoading] = useState(false);
  const [nuggetted, setNuggetted] = useState(api.currentUser?.mod_nuggets.includes(mod.id));

  useEffect(() => {
    setNuggetted(api.currentUser?.mod_nuggets.includes(mod.id));
  }, [api.currentUser]);

  async function toggleNugget() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newNuggetCount = await api.setModNugget(mod.id, !nuggetted);
      mutateMod(m => void (m.nugget_count = newNuggetCount));
      arrayToggle(api.currentUser!, "mod_nuggets", mod.id, !nuggetted);
      setNuggetted(!nuggetted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      data-tooltip-id={tooltipId}
      className={clsx(styles.nuggetButton, nuggetted && styles.setNugget)}
      onClick={toggleNugget}
    >
      <Icon type={loading ? "loading" : "nugget"} alpha={loading || nuggetted ? 1 : 0.5} />
      {mod.nugget_count}
      {!api.currentUser && (
        <Tooltip id={tooltipId} place="left" openOnClick variant="error" content="You mush sign in to rate mods!" />
      )}
    </Button>
  );
}

export function SubscriptionButton(props: ModPageContext) {
  const { mod, mutateMod } = props;
  const api = useApi();
  const tooltipId = useId();

  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(api.currentUser?.mod_subscriptions.includes(mod.id));

  useEffect(() => {
    setSubscribed(api.currentUser?.mod_subscriptions.includes(mod.id));
  }, [api.currentUser]);

  async function toggleSubscription() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newSubscriptionCount = await api.setModSubscription(mod.id, !subscribed);
      mutateMod(m => void (m.subscription_count = newSubscriptionCount));
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
      className={clsx(styles.subscriptionButton, subscribed && styles.setSubscription)}
      onClick={toggleSubscription}
    >
      <Icon type={loading ? "loading" : "check"} alpha={loading || subscribed ? 1 : 0.5} />
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

export function MiscButton(props: ModPageContext) {
  const { mod } = props;
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button data-tooltip-id={id} className={styles.miscButton} onClick={() => setIsOpen(b => !b)}>
        <Icon type="options_vert" />
      </Button>
      <Popup id={id} open={[isOpen, setIsOpen]} className={styles.miscMenu} noArrow offset={4}>
        {() => (
          <>
            <Button>
              <Icon type="edit" size={16} />
              {"Report mod"}
            </Button>
            <Button>
              <Icon type="copy" size={16} />
              {"View JSON data"}
            </Button>
          </>
        )}
      </Popup>
    </>
  );
}
