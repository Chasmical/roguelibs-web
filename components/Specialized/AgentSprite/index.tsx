"use client";
import Sprite from "@components/Common/Sprite";
import styles from "./index.module.scss";

export interface AgentSpriteProps extends AgentAppearance {
  angle: number;
  translucent?: boolean;
}
export interface AgentAppearance {
  head?: AgentPart;
  eyes?: AgentPart;
  hair?: AgentPart;
  facialHair?: AgentPart;
  body?: AgentPart;
  arm1?: AgentPart;
  arm2?: AgentPart;
  leg1?: AgentPart;
  leg2?: AgentPart;
}
export interface AgentPart {
  type?: string;
  color?: string;
}

export default function AgentSprite({ angle, translucent, ...app }: AgentSpriteProps) {
  const dir8 = convertDir8(angle);

  const rad = angle * (Math.PI / 180);
  const cos = Math.cos(rad);
  const leftAbove = rad > Math.PI;
  const rightAbove = rad < Math.PI || rad === 2 * Math.PI;

  return (
    <div className={styles.wrapper}>
      <div className={styles.anchor} style={{ opacity: translucent ? 0.8 : undefined }}>
        <Part folder="Bodies" {...app.body} dir8={dir8} size={64} x={0} y={6} z={5} />
        <Part folder="Agents" {...app.head} dir8={dir8} size={64} x={0} y={-20} z={7} />
        <Part folder="FacialHair" {...app.facialHair} dir8={dir8} size={64} x={0} y={-20} z={8} />
        <Part folder="Agents" {...app.eyes} size={64} dir8={dir8} x={0} y={-20} z={9} />
        <Part folder="Hair" {...app.hair} dir8={dir8} size={64} x={0} y={-20} z={10} />
        <Part folder="Agents" {...app.arm1} x={cos * 22} y={4} z={leftAbove ? 4 : 15} size={16} />
        <Part folder="Agents" {...app.arm2} x={-cos * 22} y={4} z={rightAbove ? 4 : 15} size={16} />
        <Part folder="Agents" {...app.leg1} x={cos * 10} y={24} z={leftAbove ? 1 : 3} size={16} />
        <Part folder="Agents" {...app.leg2} x={-cos * 10} y={24} z={rightAbove ? 1 : 3} size={16} />
      </div>
    </div>
  );
}

interface PartProps {
  folder: string;
  type?: string;
  color?: string;
  x: number;
  y: number;
  z: number;
  size?: number;
  dir8?: Dir8;
}
function Part({ folder, type, dir8, x, y, z, color, size }: PartProps) {
  if (!type || type === "None") return null;
  return (
    <Sprite
      className={styles.part}
      src={`/assets/sor1-v98/sprites/${folder}/${type}.png`}
      dir8={dir8}
      size={size}
      color={color}
      style={{ left: x, top: y, zIndex: z }}
    />
  );
}

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
type Dir8 = (typeof dirs)[number];

function convertDir8(angle: number) {
  return dirs[Math.min(Math.floor((angle + 22.5) / 45) % dirs.length)];
}
