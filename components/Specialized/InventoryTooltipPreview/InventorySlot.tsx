import styles from "./InventorySlot.module.scss";

export interface InventorySlotProps {
  sprite: string;
  tooltip: string | number;
  tooltipColor: string;
}

export default function InventorySlot({ sprite, tooltip, tooltipColor }: InventorySlotProps) {
  return (
    <div className={styles.container}>
      <img className={styles.sprite} src={sprite} alt="" />
      <span className={styles.tooltip} style={{ color: tooltipColor }}>
        {tooltip}
      </span>
    </div>
  );
}
