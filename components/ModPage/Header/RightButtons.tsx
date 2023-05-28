import { useModPage } from "@components/ModPage";
import styles from "./RightButtons.module.scss";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import clsx from "clsx";
import { useId, useState } from "react";
import Popup from "@components/Common/Popup";
import { useApi } from "@lib/API.Hooks";

export default function ModPageRightButtons() {
  const { mod } = useModPage();

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <NuggetButton />
        <SubscriptionButton />
        <MiscButton />
      </div>
    </div>
  );
}

export function NuggetButton() {
  const { mod, mutateMod } = useModPage();
  const api = useApi();

  const [loading, setLoading] = useState(false);
  const [myNugget, setMyNugget] = useState(false); // TODO

  async function toggleNugget() {
    if (loading) return;
    setLoading(true);
    try {
      const newNuggetCount = await api.setModNugget(mod.id, !myNugget);
      mutateMod(m => void (m.nugget_count = newNuggetCount));
      setMyNugget(!myNugget);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button sleek className={clsx(styles.nuggetButton, myNugget && styles.setNugget)} onClick={toggleNugget}>
      <Icon type={loading ? "loading" : "nugget"} alpha={loading || myNugget ? 1 : 0.5} />
      {mod.nugget_count}
    </Button>
  );
}

export function SubscriptionButton() {
  const { mod } = useModPage();

  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function toggleSubscription() {
    if (loading) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSubscribed(!subscribed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      sleek
      className={clsx(styles.subscriptionButton, subscribed && styles.setSubscription)}
      onClick={toggleSubscription}
    >
      <Icon type={loading ? "loading" : "check"} alpha={loading || subscribed ? 1 : 0.5} />
      {subscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}

export function MiscButton() {
  const { mod } = useModPage();
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button sleek data-tooltip-id={id} className={styles.miscButton} onClick={() => setIsOpen(b => !b)}>
        <Icon type="options_vert" />
      </Button>
      <Popup id={id} open={[isOpen, setIsOpen]}>
        {() => (
          <div className={styles.miscMenu}>
            <span>Woah</span>
            <span>A hidden menu</span>
            <span>Incredible</span>
          </div>
        )}
      </Popup>
    </>
  );
}
