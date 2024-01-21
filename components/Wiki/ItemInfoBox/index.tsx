"use client";
import type { ItemInfo } from "@app/assets/sor1-v98/items.json";
import Icon from "@components/Common/Icon";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import clsx from "clsx";
import Popup from "@components/Common/Popup";
import { lazy, useId, useState } from "react";

const ItemCostCalculator = lazy(() => import("@components/Wiki/ItemCostCalculator"));

export interface ItemInfoBoxProps {
  info: ItemInfo;
  name: string;
  description: string;
}

export default function ItemInfoBox({ info, name, description }: ItemInfoBoxProps) {
  const calcId = useId();
  const [calcOpen, setCalcOpen] = useState(false);

  return (
    <div role="panel" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.title}>{name ?? info.invItemName}</div>
          <img
            className={styles.sprite}
            src={`/assets/sor1-v98/sprites/Items/${info.spriteName}.png`}
            title={name}
            alt={name}
          />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{"Properties"}</div>
          <table className={styles.datatable}>
            <tbody>
              <tr>
                <th>{"Type"}</th>
                <td>
                  <Link>{info.itemType}</Link>
                </td>
              </tr>
              <tr>
                <th>{"Cost"}</th>
                <td>
                  <b>{info.itemValue}</b>
                  <Icon data-tooltip-id={calcId} type="money" size={24} onClick={() => setCalcOpen(true)} />
                  <Popup place="bottom" id={calcId} isOpen={calcOpen} setIsOpen={setCalcOpen}>
                    {() => <ItemCostCalculator info={info} />}
                  </Popup>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {description && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{"Description"}</div>
            <blockquote className={styles.description}>{description}</blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
