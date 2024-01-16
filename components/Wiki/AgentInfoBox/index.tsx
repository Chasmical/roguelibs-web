import type { AgentInfo } from "@app/assets/sor1-v98/agent-data.json";
import AgentSprite from "@components/Specialized/AgentSprite";
import Link from "@components/Common/Link";
import styles from "./index.module.scss";

export interface AgentInfoBoxProps {
  info: AgentInfo;
  name: string;
  description: string;
}
export default function AgentInfoBox({ info, name, description }: AgentInfoBoxProps) {
  return (
    <div role="panel" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.title}>{name ?? info.agentName}</div>
          <AgentSprite headType="Head" facialHairType="None" bodyType={info.agentName} hairType="None" angle={180} />
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
