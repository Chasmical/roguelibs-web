import { fetchAssetJson } from "@lib/utils/fetch";

export const fetchAgentData = fetchAssetJson<AgentData>("assets", "agent-data.json");

export interface AgentData {
  // baseline: Partial<AgentInfo>;
  entries: Partial<AgentInfo>[];
}

type StatusEffectName = string;
type SpriteName = string;
type AgentName = string;

type float = number;
type int = number;
type bool = boolean;

export interface AgentInfo {
  agentName: string;

  notes?: string[];
}
