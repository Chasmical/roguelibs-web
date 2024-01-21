"use client";
import { useMemo, useState } from "react";
import { ItemInfo } from "@app/assets/sor1-v98/items.json";
import IconButtonGroup from "@components/Common/IconButtonGroup";
import IconButton from "@components/Common/IconButton";
import CalculatorOutput, { Relationship } from "./CalculatorOutput";
import { clamp } from "@lib/utils/misc";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface ItemCostCalculatorProps {
  info: ItemInfo;
}
export default function ItemCostCalculator({ info }: ItemCostCalculatorProps) {
  const [count, setCount] = useState(info.initCount || 1);
  const [thiefHonor, setThiefHonor] = useState(0);
  const [tradeTrait, setTradeTrait] = useState(0);
  const [trader, setTrader] = useState("Generic");
  const [floor, setFloor] = useState(1);
  const [relationship, setRelationship] = useState<Relationship>("Neutral");
  const [hacked, setHacked] = useState(false);

  function changedCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(clamp(+e.currentTarget.value || 0, 0, 999));
  }
  function toggleThiefHonor(value: number | null) {
    setThiefHonor(value || 0);
  }
  function toggleTradeTrait(value: number | null) {
    setTradeTrait(value || 0);
  }
  function toggleTrader(value: string | null) {
    value && setTrader(value);
  }
  function toggleFloor(value: number | null) {
    value && setFloor(value);
  }
  function toggleRelationship(value: string | null) {
    value && setRelationship(value as Relationship);
  }

  const context = useMemo<CostContext>(() => {
    return {
      info,
      count,
      traits: [
        thiefHonor === 1 && "HonorAmongThieves",
        thiefHonor === 2 && "HonorAmongThieves2",
        tradeTrait === -1 && "BadTrader",
        tradeTrait === 1 && "GoodTrader",
        tradeTrait === 2 && "GoodTrader2",
      ].filter(Boolean) as string[],
      mutators: ["QuickGame", "HighCost"],
      player: "Generic",
      interactee: trader,
      transaction: "AgentItemSale",
      relationship,
      chunk: "Generic",
      hacked,
      level: floor,
    };
  }, [info, count, thiefHonor, tradeTrait, trader, floor, relationship, hacked]);

  const canChangeCount =
    (info.stackable ||
      info.itemType === "WeaponProjectile" ||
      info.itemType === "WeaponMelee" ||
      info.isArmor ||
      info.isArmorHead) &&
    info.initCount &&
    !info.noCountText &&
    !info.rechargeAmount &&
    !info.rechargeAmountInverse;

  return (
    <div className={styles.container}>
      <div className={styles.panels}>
        <div className={styles.itemPanel}>
          <img className={styles.sprite} src={`/assets/sor1-v98/sprites/Items/${info.spriteName}.png`} alt="" />
          <div className={styles.countInput}>
            <span>{"Count:"}</span>
            <input
              type="number"
              value={"" + count}
              onChange={changedCount}
              min={0}
              max={999}
              disabled={!canChangeCount}
            />
          </div>
        </div>

        <div className={styles.configWrapper}>
          <div className={styles.configLine}>
            <div className={styles.config}>
              <span>{"Floor:"}</span>
              <div>
                <IconButtonGroup className={styles.floorSelect} value={floor} onChange={toggleFloor}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <IconButton key={i} size={16} type="person" value={i + 1} />
                  ))}
                </IconButtonGroup>
              </div>
            </div>

            <div className={styles.configCol}>
              <div className={styles.configLine}>
                <div className={styles.config}>
                  <span>{"Buying from:"}</span>
                  <IconButtonGroup value={trader} onChange={toggleTrader}>
                    <IconButton size={16} type="person" value="Generic" />
                    <IconButton size={16} type="person" value="Shopkeeper" />
                    <IconButton size={16} type="person" value="Clerk" />
                    <IconButton size={16} type="person" value="Thief" />
                    <IconButton size={16} type="person" value="LoadoutMachine" />
                    <IconButton size={16} type="person" value="CloneMachine" />
                    <IconButton size={16} type="person" value="AmmoDispenser" />
                  </IconButtonGroup>
                </div>
                <div className={styles.config}>
                  <span>{"Selling to:"}</span>
                  <IconButtonGroup value={trader} onChange={toggleTrader}>
                    <IconButton size={16} type="person" value="SellOMatic" />
                    <IconButton size={16} type="person" value="PortableSellOMatic" />
                  </IconButtonGroup>
                </div>
              </div>
              <div className={styles.configLine}>
                <div className={styles.config}>
                  <span>{"Trading traits:"}</span>
                  <IconButtonGroup value={tradeTrait} onChange={toggleTradeTrait}>
                    <IconButton size={16} type="person" value={-1} />
                    <IconButton size={16} type="person" value={1} />
                    <IconButton size={16} type="person" value={2} />
                  </IconButtonGroup>
                  <span>{"Honor Among Thieves:"}</span>
                  <IconButtonGroup value={thiefHonor} onChange={toggleThiefHonor}>
                    <IconButton size={16} type="person" value={1} />
                    <IconButton size={16} type="person" value={2} />
                  </IconButtonGroup>
                </div>
                <div className={styles.config}>
                  <span>{"Relationship:"}</span>
                  <IconButtonGroup value={relationship} onChange={toggleRelationship}>
                    <IconButton size={16} type="person" value="Neutral" />
                    <IconButton size={16} type="person" value="Friendly" />
                    <IconButton size={16} type="person" value="Loyal" />
                    <IconButton size={16} type="person" value="Aligned" />
                    <IconButton size={16} type="person" value="Submissive" />
                  </IconButtonGroup>
                  <span>{"Is Hacked:"}</span>
                  <IconButton
                    square
                    size={16}
                    type={hacked ? "check_small" : "cross_small"}
                    onClick={() => setHacked(v => !v)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CalculatorOutput itemValue={info.itemValue} context={context} />
    </div>
  );
}

export interface CostContext {
  info: ItemInfo;
  count: number;
  traits: string[];
  mutators: string[];
  player?: string;
  interactee?: string;
  transaction?: string;
  relationship: Relationship;
  chunk?: string;
  hacked?: boolean;
  level: number;
}
