"use client";
import { useMemo, useState } from "react";
import { ItemInfo } from "@app/assets/sor1-v98/item-data.json";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface ItemCostCalculatorProps {
  info: ItemInfo;
}
export default function ItemCostCalculator({ info }: ItemCostCalculatorProps) {
  const [count, setCount] = useState(info.initCount);

  function changedCount(e: React.ChangeEvent<HTMLInputElement>) {
    setCount(clamp(+e.currentTarget.value || 0, 0, 999));
  }

  const context = useMemo<CostContext>(() => {
    return {
      info,
      count,
      traits: ["BadTrader"],
      mutators: ["QuickGame", "HighCost"],
      player: "Generic",
      interactee: "Generic",
      transaction: "AgentItemSale",
      relationship: "Neutral",
      chunk: "Generic",
      hacked: false,
    };
  }, [info, count]);

  const modifiers = useMemo(() => calculateModifiers(context), [context]);

  let cost = info.itemValue;

  return (
    <div className={styles.container}>
      <div className={styles.panels}>
        <div className={styles.itemPanel}>
          <img className={styles.sprite} src={`/assets/sor1-v98/sprites/Items/${info.spriteName}.png`} alt="" />
          <div className={styles.countInput}>
            <span>{"Count:"}</span>
            <input type="number" value={"" + count} onChange={changedCount} min={0} max={999} />
          </div>
        </div>

        <div className={styles.traders}></div>
      </div>
      <div className={styles.output}>
        <table className={styles.outputWindow}>
          <tbody>
            <tr className={styles.outputLine}>
              <td>{info.itemValue}</td>
              <td></td>
              <td>{"Original cost"}</td>
            </tr>
            {modifiers.map((mod, index) => {
              const prevCost = Math.round(cost * 100) / 100;
              let active = false;
              let num = "";

              if (mod.type === "multiply") {
                active = mod.value != 1;
                num = "×" + (mod.formula ?? mod.value);
                cost *= mod.value;
              } else if (mod.type === "add") {
                active = mod.value != 0;
                num = (mod.value >= 0 ? "+" : "") + (mod.formula ?? mod.value);
                cost += mod.value;
              } else if (mod.type === "min") {
                active = cost < mod.value;
                num = `min(${mod.formula ?? mod.value})`;
                cost = Math.max(cost, mod.value);
              }

              return (
                <tr key={index} className={clsx(styles.outputLine, styles.multiplierLine, !active && styles.inactive)}>
                  <td className={styles.prevCost}>{prevCost}</td>
                  <td>{num}</td>
                  <td>{mod.message}</td>
                </tr>
              );
            })}
            <tr className={styles.outputLine}>
              <td>{Math.floor(cost)}</td>
              <td></td>
              <td>{"Total"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const relationships = ["Neutral", "Friendly", "Loyal", "Aligned", "Submissive"] as const;
type Relationship = (typeof relationships)[number];

export interface CostContext {
  info: ItemInfo;
  count: number;
  traits: string[];
  mutators: string[];
  player?: string;
  interactee?: string;
  transaction?: string;
  relationship?: Relationship;
  chunk?: string;
  hacked?: boolean;
}

type AddModifier = (type: "multiply" | "add" | "min", value: number, message: string, formula?: string) => void;
type Modifier = { type: "multiply" | "add" | "min"; value: number; message: string; formula?: string };

function calculateModifiers(cxt: CostContext) {
  const mods: Modifier[] = [];
  const mod: AddModifier = (type, value, message, formula) => {
    mods.push({ type, value, message, formula });
  };

  calculateModifiersDurability(cxt, mod);
  calculateModifiersGeneric(cxt, mod);

  return mods;
}
function calculateModifiersDurability({ info, count, interactee, transaction }: CostContext, mod: AddModifier) {
  const originalCost = info.itemValue;
  const attachments = info.contents.length;

  if (interactee != "AmmoDispenser" || transaction === "PortableSellOMatic") {
    if (info.itemType === "WeaponProjectile" && info.rechargeAmount === 0 && info.rechargeAmountInverse === 0) {
      // Projectile weapon
      mod("multiply", count / info.maxAmmo, "Ammo multiplier", `(${count}/${info.maxAmmo})`);
      mod("min", originalCost * 0.1, "Can't be cheaper than 1/10 of original cost");
      mod("add", attachments * 30, "Weapon mods bonus", `${attachments}×30`);
    } else if (info.itemType === "WeaponMelee") {
      // Melee weapon
      const formula = `${Math.round((count / info.initCount) * 1000) / 10}%`;
      if (count > info.initCount && ["AgentItemSale", "ArtOfTheDealSale", "LoadoutMachine"].includes(transaction!)) {
        mod("multiply", 1, "Durability bonus is not applied when buying", formula);
      } else {
        mod("multiply", count / info.initCount, `Durability ${count > info.initCount ? "bonus" : "penalty"}`, formula);
      }
      mod("min", originalCost * 0.1, "Can't be cheaper than 1/10 of original cost");
      mod("add", attachments * 30, "Weapon mods bonus", `${attachments}×30`);
    } else if (info.isArmor || info.isArmorHead) {
      // Armor
      const formula = `${count}/${info.initCount}`;
      mod("multiply", count / info.initCount, `Durability ${count > info.initCount ? "bonus" : "penalty"}`, formula);
      mod("min", originalCost * 0.1, "Can't be cheaper than 1/10 of original cost");
      mod("add", clamp((attachments - 1) * 30, 0, 100), "Armor mods bonus", `${attachments - 1}×30`);
    } else if (info.hasCharges) {
      // Tool with charges
      mod("multiply", count, "Item count");
      mod("min", originalCost * 0.1, "Can't be cheaper than 1/10 of original cost");
    } else if (info.invItemName !== "WaterPistol") {
      // A regular item
      mod("multiply", count, "Item count");
    }
  }
}
function calculateModifiersGeneric({ interactee, traits, ...cxt }: CostContext, mod: AddModifier) {
  let level = clamp(1, 1, 15); // TODO: curLevelEndless

  switch (cxt.transaction) {
    case "AgentItemSale":
    case "ArtOfTheDealSale": {
      // TODO: when using voucher, multiply cost by 0

      const activeTrait = (() => {
        if (traits.includes("HonorAmongThieves2") && interactee === "Thief") return "HonorAmongThieves2";
        if (traits.includes("GoodTrader2")) return "GoodTrader2";
        if (traits.includes("HonorAmongThieves") && interactee === "Thief") return "HonorAmongThieves";
        if (traits.includes("GoodTrader")) return "GoodTrader";
        if (traits.includes("BadTrader")) return "BadTrader";
      })();

      if (traits.includes("HonorAmongThieves2")) {
        mod("multiply", activeTrait === "HonorAmongThieves2" ? 0.3 : 1, '"Honor Among Thieves +" trait', "0.3");
      }
      if (traits.includes("GoodTrader2")) {
        mod("multiply", activeTrait === "GoodTrader2" ? 0.3 : 1, '"Shrewd Negotiator +" trait', "0.3");
      }
      if (traits.includes("HonorAmongThieves")) {
        mod("multiply", activeTrait === "HonorAmongThieves" ? 0.65 : 1, '"Honor Among Thieves" trait', "0.65");
      }
      if (traits.includes("GoodTrader")) {
        const mult = cxt.mutators.includes("SuperSpecialAbilities") ? 0.4 : 0.65;
        mod("multiply", activeTrait === "GoodTrader" ? mult : 1, '"Shrewd Negotiator" trait', "" + mult);
      }
      if (traits.includes("BadTrader")) {
        mod("multiply", activeTrait === "BadTrader" ? 1.25 : 1, '"Sucker" trait', "1.25");
      }

      if (interactee === "Clerk" && cxt.chunk === "MovieTheater") {
        mod("multiply", 2.5, "Movie theater multiplier");
      }
      break;
    }
    case "CloneMachineItem":
      mod("multiply", 1.25, "Clone machine multiplier");
      break;
    case "LoadoutMachine":
      if (cxt.player === "Soldier" && cxt.mutators.includes("SuperSpecialAbilities")) {
        mod("multiply", 0, "Soldier's Super Special Ability");
      }
      mod("multiply", 0.75, "Loadout-O-Matic multiplier");
      break;
    case "AmmoDispenser":
      mod("multiply", 0.75, "Ammo Dispenser multiplier");
      if (cxt.hacked) {
        mod("multiply", 0.75, "Hacked Ammo Dispenser multiplier");
      }
      if ((cxt.player === "Soldier" || cxt.player === "Doctor") && cxt.mutators.includes("SuperSpecialAbilities")) {
        mod("multiply", 0, `${cxt.player}'s Super Special Ability`);
      }
      break;
  }
  // floor level adjustment
  mod("multiply", 1 + (level - 1) * 0.075, "Floor difficulty adjustment");

  if (interactee) {
    // TODO: properly check that it's an agent
    if (
      cxt.mutators.includes("SuperSpecialAbilities") &&
      cxt.player === "Shopkeeper" &&
      cxt.transaction !== "AgentItemSale" &&
      cxt.transaction !== "ArtOfTheDealSale"
    ) {
      mod("multiply", 0.6, "Shopkeeper's Super Special Ability");
    }
    const mult =
      cxt.relationship === "Friendly"
        ? 0.9
        : cxt.relationship === "Loyal"
          ? 0.8
          : cxt.relationship === "Aligned"
            ? 0.7
            : cxt.relationship === "Submissive"
              ? 0.6
              : 1;

    mod("multiply", mult, `${cxt.relationship} relationship multiplier`);
  }
  if (cxt.mutators.includes("HighCost")) {
    mod("multiply", 1.4, '"High Costs" mutator');
  }
  if (cxt.mutators.includes("QuickGame")) {
    mod("multiply", 0.8, '"Quick Game" mutator');
  }
}

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}
