import { AgentInfo, fetchAgentData } from "@app/assets/sor1-v98/agent-data.json";
import { fetchLocale } from "@app/assets/sor1-v98/locale";
import AgentInfoBox from "@components/Wiki/AgentInfoBox";

export default async function AgentInfoBoxServer({ agentName }: { agentName: string }) {
  const agentData = await fetchAgentData();
  const agentEntry = agentData.entries.find(e => e.agentName === agentName);
  if (!agentEntry) return <>{"Not found."}</>;

  const locale = (await fetchLocale("en"))!;
  const name = locale.Categories["Agent"][agentName];
  const description = locale?.Categories["Description"][agentName];

  const info = agentEntry as AgentInfo;
  return <AgentInfoBox info={info} name={name} description={description} />;
}
