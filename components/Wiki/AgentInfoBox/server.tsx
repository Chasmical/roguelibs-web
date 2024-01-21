import { AgentInfo, fetchAgentData } from "@app/assets/sor1-v98/agents.json";
import select, { treeRandom } from "@app/assets/sor1-v98/agents.json/select";
import { fetchLocale } from "@app/assets/sor1-v98/locale";
import AgentInfoBox from "@components/Wiki/AgentInfoBox";

export default async function AgentInfoBoxServer({ agentName }: { agentName: string }) {
  const agentData = await fetchAgentData();
  const agentEntry = agentData.entries.find(e => e.agentName === agentName);
  if (!agentEntry) return <>{"Not found."}</>;

  const locale = (await fetchLocale("en"))!;
  const name = locale.Categories["Agent"][agentName];
  const description = locale?.Categories["Description"][agentName];

  const info = { ...agentData.baseline, ...agentEntry } as AgentInfo;
  info.legsColor = treeRandom(info.legsColor, [agentData.colors]);

  const selection = select(agentData, info);

  return <AgentInfoBox info={info} name={name} description={description} selection={selection} />;
}
