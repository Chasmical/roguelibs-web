"use client";
import Sprite from "@components/Common/Sprite";
import styles from "./index.module.scss";

export interface AgentSpriteProps {
  angle: number;
  headType: string | undefined;
  bodyType: string;
  eyesType: string | undefined;
  hairType: string;
  facialHairType: string;
  headColor?: string;
  bodyColor?: string;
  eyesColor?: string;
  hairColor?: string;
  facialHairColor?: string;
  skinColor?: string;
  legsColor?: string;
}

export default function AgentSprite({
  angle,
  headType,
  bodyType,
  eyesType,
  hairType,
  facialHairType,
  bodyColor,
  eyesColor,
  hairColor,
  facialHairColor,
  skinColor,
  legsColor,
}: AgentSpriteProps) {
  const dir = convertDir8(angle);

  const angleRad = angle * (Math.PI / 180);
  const swing = Math.cos(angleRad);

  const showEyes = eyesType && !["N", "NE", "NW"].includes(dir);

  return (
    <div className={styles.wrapper}>
      <div className={styles.anchor}>
        <Part path={`Bodies/${bodyType}${dir}`} x={0} y={6} z={5} color={bodyColor} />
        {headType && <Part path={`Agents/${headType}${dir}`} x={0} y={-20} z={7} color={skinColor} />}
        {showEyes && <Part path={`Agents/${eyesType}${dir}`} x={0} y={-18} z={8} color={eyesColor} />}
        <Part path={`Agents/Arm`} x={swing * 22} y={4} z={angleRad > Math.PI ? 4 : 6} size={16} color={skinColor} />
        <Part path={`Agents/Arm`} x={-swing * 22} y={4} z={angleRad < Math.PI ? 4 : 6} size={16} color={skinColor} />
        <Part path={`Agents/Leg`} x={swing * 10} y={24} z={angleRad > Math.PI ? 1 : 3} size={16} color={legsColor} />
        <Part path={`Agents/Leg`} x={-swing * 10} y={24} z={angleRad < Math.PI ? 1 : 3} size={16} color={legsColor} />
        {/* <Part path={`Hair/${hairType}${dir}`} x={0} y={-18} z={8} color={hairColor} /> */}
        {/* <Part path={`FacialHair/${facialHairType}${dir}`} x={0} y={-18} z={8} color={facialHairColor} /> */}
      </div>
    </div>
  );
}

interface PartProps {
  path: string;
  x: number;
  y: number;
  z?: number;
  color?: string;
  size?: number;
}
function Part({ path, x, y, z, color, size }: PartProps) {
  return (
    <Sprite
      className={styles.part}
      size={size}
      src={`/assets/sor1-v98/sprites/${path}.png`}
      color={color}
      style={{ left: x, top: y, zIndex: z }}
    />
  );
}

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function convertDir8(angle: number) {
  return dirs[Math.min(Math.floor((angle + 22.5) / 45) % dirs.length)];
}
