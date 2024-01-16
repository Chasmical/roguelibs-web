import { memo, useMemo } from "react";
import type { CostContext } from ".";
import { clamp, round } from "@lib/utils/misc";
import styles from "./CalculatorOutput.module.scss";
import clsx from "clsx";

export interface CalculatorOutputProps {
  itemValue: number;
  context: CostContext;
}

const CalculatorOutput = memo(function CalculatorOutput({ itemValue, context }: CalculatorOutputProps) {
  const modifiers = useMemo(() => calculateModifiers(context), [context]);
  let cost = itemValue;

  return (
    <div className={styles.output}>
      <table className={styles.outputWindow}>
        <tbody>
          <tr className={styles.outputLine}>
            <td>{cost}</td>
            <td></td>
            <td>{"Base cost"}</td>
          </tr>
          {modifiers.map((mod, index) => {
            const prevCost = round(cost, 2);
            let active = false;
            let num = "";

            if (mod.type === "multiply") {
              active = mod.value != 1;
              num = "×" + (mod.formula ?? round(mod.value, 2));
              cost *= mod.value;
            } else if (mod.type === "add") {
              active = mod.value != 0;
              num = (mod.value >= 0 ? "+" : "") + (mod.formula ?? round(mod.value, 2));
              cost += mod.value;
            } else if (mod.type === "min") {
              active = cost < mod.value;
              num = `min(${mod.formula ?? round(mod.value, 2)})`;
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
            <td>{round(cost, 2)}</td>
            <td></td>
            <td></td>
          </tr>
          <tr className={styles.outputLine}>
            <td>{Math.floor(cost)}</td>
            <td></td>
            <td>{"Total"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
export default CalculatorOutput;

type AddModifier = (type: "multiply" | "add" | "min", value: number, message: string, formula?: string) => void;
type Modifier = { type: "multiply" | "add" | "min"; value: number; message: string; formula?: string };

export function applyModifiers(itemValue: number, mods: Modifier[]) {
  let cost = itemValue;

  for (const mod of mods) {
    if (mod.type === "multiply") {
      cost *= mod.value;
    } else if (mod.type === "add") {
      cost += mod.value;
    } else if (mod.type === "min") {
      cost = Math.max(cost, mod.value);
    }
  }
  return Math.floor(cost);
}

export function calculateModifiers(cxt: CostContext) {
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
      mod("min", originalCost * 0.1, "At least 1/10 of base cost");
      mod("add", attachments * 30, "Weapon mods bonus", `${attachments}×30`);
    } else if (info.itemType === "WeaponMelee") {
      // Melee weapon
      const durability = count / info.initCount;
      const formula = Number.isFinite(durability) ? `${round(durability * 100, 1)}%` : `(${count}/0)%`;
      if (count > info.initCount && ["AgentItemSale", "ArtOfTheDealSale", "LoadoutMachine"].includes(transaction!)) {
        mod("multiply", 1, "Durability bonus is not applied when buying", formula);
      } else {
        mod("multiply", durability, `Durability ${durability > 1 ? "bonus" : "penalty"}`, formula);
      }
      mod("min", originalCost * 0.1, "At least 1/10 of base cost");
      mod("add", attachments * 30, "Weapon mods bonus", `${attachments}×30`);
    } else if (info.isArmor || info.isArmorHead) {
      // Armor
      const durability = count / info.initCount;
      const formula = Number.isFinite(durability) ? `${round(durability * 100, 1)}%` : `(${count}/0)%`;
      mod("multiply", durability, `Durability ${durability > 1 ? "bonus" : "penalty"}`, formula);
      mod("min", originalCost * 0.1, "At least 1/10 of base cost");
      mod("add", clamp((attachments - 1) * 30, 0, 100), "Armor mods bonus", `${Math.max(attachments - 1, 0)}×30`);
    } else if (info.hasCharges) {
      // Tool with charges
      mod("multiply", count, "Item count");
      mod("min", originalCost * 0.1, "At least 1/10 of base cost");
    } else if (info.invItemName !== "WaterPistol") {
      // A regular item
      mod("multiply", count, "Item count");
    }
  }
}
function calculateModifiersGeneric({ interactee, traits, ...cxt }: CostContext, mod: AddModifier) {
  let level = clamp(cxt.level, 1, 15);

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
    const mult = [1, 0.9, 0.8, 0.7, 0.6][relationships.indexOf(cxt.relationship)];
    mod("multiply", mult, `${cxt.relationship} relationship multiplier`);
  }
  if (cxt.mutators.includes("HighCost")) {
    mod("multiply", 1.4, '"High Costs" mutator');
  }
  if (cxt.mutators.includes("QuickGame")) {
    mod("multiply", 0.8, '"Quick Game" mutator');
  }
}

const relationships = ["Neutral", "Friendly", "Loyal", "Aligned", "Submissive"] as const;
export type Relationship = (typeof relationships)[number];
