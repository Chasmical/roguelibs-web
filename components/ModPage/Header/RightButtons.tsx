"use client";
import { ModPageContext } from "@components/ModPage";
import styles from "./RightButtons.module.scss";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { useId, useState } from "react";
import Popup from "@components/Common/Popup";
import SubscriptionButton from "@components/Specialized/SubscriptionButton";
import NuggetButton from "@components/Specialized/NuggetButton";

export default function ModPageRightButtons(props: ModPageContext) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <NuggetButton mod={props.mod} mutateMod={props.mutateMod} />
        <SubscriptionButton mod={props.mod} mutateMod={props.mutateMod} />
        <MiscButton {...props} />
      </div>
    </div>
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
