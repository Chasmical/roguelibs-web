"use client";
import type { AgentInfo } from "@app/assets/sor1-v98/agent-data.json";
import useAnimationFrame from "@lib/hooks/useAnimationFrame";
import AgentSprite from "@components/Specialized/AgentSprite";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import { useState } from "react";

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

  return (
    <div role="panel" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.section} onClick={toggleRotation}>
          <div className={styles.title}>{name ?? info.agentName}</div>
          <AgentSprite
            headType={info.usesNewHead ? undefined : "Head"}
            eyesType={info.usesNewHead ? undefined : (info.eyesType as string)}
            bodyType={info.agentName}
            bodyColor={["Wrestler", "ShapeShifter"].includes(info.agentName) ? skinColor : undefined}
            hairType={hairType}
            hairColor={hairColor}
            facialHairType={facialHairType}
            skinColor={skinColor}
            legsColor={info.legsColor as string}
            angle={angle}
          />
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
