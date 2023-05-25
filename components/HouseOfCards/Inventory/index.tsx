import CardOnDisplay from "../CardOnDisplay";
import { useGame } from "../hooks";
import styles from "./index.module.scss";
import clsx from "clsx";

export default function Inventory() {
  const { ui, deck, mutate } = useGame();

  return (
    <div className={clsx(styles.wrapper, ui === "inventory" && styles.open)}>
      <div
        className={styles.openCloseButton}
        onClick={() => mutate(g => void (g.ui = g.ui === "inventory" ? "map" : "inventory"))}
      >
        {ui === "inventory" ? "C" : "O"}
      </div>
      <div className={styles.backText}>{"The player's deck and inventory"}</div>
      <div className={styles.cardGrid}>
        {deck.map(card => (
          <CardOnDisplay key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
