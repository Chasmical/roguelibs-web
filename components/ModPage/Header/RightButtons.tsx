"use client";
import styles from "./RightButtons.module.scss";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { useId, useState } from "react";
import Popup from "@components/Common/Popup";
import SubscriptionButton from "@components/Specialized/SubscriptionButton";
import NuggetButton from "@components/Specialized/NuggetButton";
import { useApi } from "@lib/hooks";
import Tooltip from "@components/Common/Tooltip";
import { useModPage, useModPageDispatch } from "../redux";

export default function ModPageRightButtons() {
  const tooltipId = useId();
  const api = useApi();
  const dispatch = useModPageDispatch();

  const mod_id = useModPage(s => s.mod.id);
  const nugget_count = useModPage(s => s.original.nugget_count);
  const sub_count = useModPage(s => s.original.subscription_count);

  function onChangedNugget(v: number) {
    dispatch(s => (s.original.nugget_count = v));
  }
  function onChangedSub(v: number) {
    dispatch(s => (s.original.subscription_count = v));
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <NuggetButton mod_id={mod_id} value={nugget_count} onChange={onChangedNugget} data-tooltip-id={tooltipId} />
        <SubscriptionButton mod_id={mod_id} value={sub_count} onChange={onChangedSub} data-tooltip-id={tooltipId} />
        {!api.currentUser && (
          <Tooltip id={tooltipId} place="top" openOnClick variant="error" content="" delayHide={-1} />
        )}
        <MiscButton />
      </div>
    </div>
  );
}

export function MiscButton() {
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
