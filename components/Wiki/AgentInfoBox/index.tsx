"use client";
import type { AgentInfo } from "@app/assets/sor1-v98/agents.json";
import useAnimationFrame from "@lib/hooks/useAnimationFrame";
import AgentSprite, { AgentAppearance } from "@components/Specialized/AgentSprite";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";

export interface AgentInfoBoxProps {
  info: AgentInfo;
  name: string;
  description: string;
  selection: {
    hairType: string;
    facialHairType: string;
    hairColor: string;
    skinColor: string;
  };
}
export default function AgentInfoBox({ info, name, description, selection }: AgentInfoBoxProps) {
  const [rotating, setRotating] = useState(false);
  const [angle, setAngle] = useState(180);
  const { hairType, hairColor, skinColor, facialHairType } = selection;

  useAnimationFrame(delta => {
    rotating && setAngle(a => (a + delta * 0.18) % 360);
  });

  function toggleRotation() {
    setRotating(v => !v);
    setAngle(a => Math.round(a / 45) * 45);
  }

  const appearance = useMemo<AgentAppearance>(
    () => ({
      body: {
        type: ["MechEmpty", "MechFilled"].includes(info.agentName) ? "Mech" : info.agentName,
        color: ["Wrestler", "ShapeShifter", "Ghost"].includes(info.agentName) ? skinColor : undefined,
      },
      head: { type: info.usesNewHead ? undefined : info.headType, color: skinColor },
      eyes: { type: info.usesNewHead ? undefined : (info.eyesType as string), color: info.eyesColor as string },
      hair: { type: hairType, color: hairColor },
      facialHair: { type: facialHairType, color: hairColor },
      arm1: { type: "Arm", color: skinColor },
      arm2: { type: "Arm", color: skinColor },
      leg1: { type: "Leg", color: info.legsColor as string },
      leg2: { type: "Leg", color: info.legsColor as string },
      translucent: info.ghost || info.hologram,
    }),
    [info],
  );

  return (
    <div role="panel" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.section} onClick={toggleRotation}>
          <div className={styles.title}>{name ?? info.agentName}</div>
          <AgentSprite {...appearance} angle={angle} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{"Properties"}</div>
          <table className={styles.datatable}>
            <tbody></tbody>
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
