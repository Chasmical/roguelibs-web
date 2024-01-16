"use client";
import styles from "./index.module.scss";

export interface AgentSpriteProps {
  angle: number;
  hairType: string;
  facialHairType: string;
  headType: string;
  bodyType: string;
}
export default function AgentSprite({ angle, hairType, facialHairType, headType, bodyType }: AgentSpriteProps) {
  const dir = convertDir8(angle);
  console.log(dir);

  return (
    <div className={styles.wrapper}>
      <div className={styles.anchor}>
        <img className={styles.part} src={`/assets/sor1-v98/sprites/Bodies/${bodyType}${dir}.png`} alt="" />
      </div>
    </div>
  );
}

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function convertDir8(angle: number) {
  return dirs[Math.floor((angle + 22.5) / 45)];
}
