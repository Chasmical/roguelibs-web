import { DbCard } from "@lib/Database";
import styles from "./index.module.scss";
import { MouseEventHandler, useCallback, useRef, useState } from "react";

const ANGLE = 15;

export interface CardOnDisplayProps {
  card: DbCard;
  onClick?: React.MouseEventHandler;
}
export default function CardOnDisplay({ card, onClick }: CardOnDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<[x: number, y: number]>([0, 0]);

  const updateAngle = useCallback<MouseEventHandler<HTMLDivElement>>(e => {
    const rect = cardRef.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.x;
    const offsetY = e.clientY - rect.y;
    let y = ((offsetX - rect.width * 0.5) / rect.width) * ANGLE;
    let x = ((1 - (offsetY - rect.height * 0.5)) / rect.height) * ANGLE;
    setAngle([x, y]);
  }, []);

  const resetAngle = useCallback(() => setAngle([0, 0]), []);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onClick={onClick}
      onMouseEnter={updateAngle}
      onMouseMove={updateAngle}
      onMouseLeave={resetAngle}
      style={{
        transform:
          angle[0] || angle[1] ? `perspective(400px) rotateX(${angle[0]}deg) rotateY(${angle[1]}deg)` : undefined,
      }}
    >
      <img
        className={styles.image}
        src={card.image ?? "/placeholder-10-square.png"}
        alt=""
        onMouseDown={e => e.preventDefault()}
      />
      <div className={styles.name}>{card.name}</div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: card.description }}></div>
      {card.cost != null && (
        <div className={styles.nuggetCost}>
          <span className={styles.statText}>{card.cost}</span>
        </div>
      )}
      {card.attack != null && (
        <div className={styles.attackPoints}>
          <span className={styles.statText}>{card.attack}</span>
        </div>
      )}
      {card.health != null && (
        <div className={styles.healthPoints}>
          <span className={styles.statText}>{card.health}</span>
        </div>
      )}
    </div>
  );
}
