import { fetchAssetJson } from "@lib/utils/fetch";
import { WeightedArray, WeightedMap } from "@lib/utils/random";

const agentDataJson = fetchAssetJson<AgentData>("assets", "agent-data.json");

export const fetchAgentData = async () => {
  const json = await agentDataJson();
  return json;
};

export type WeightedString = string | string[] | WeightedArray<string> | WeightedMap<string>;

export interface AgentData {
  baseline: Partial<AgentInfo>;
  entries: Partial<AgentInfo>[];

  colors: Record<string, string>;
  skinColors: Record<string, WeightedString>;
  hairTypes: Record<string, WeightedString>;
  facialHairTypes: Record<string, WeightedString>;
  hairColors: Record<string, WeightedString>;
  hairCanHaveFacialHair: string[];
}

type float = number;
type int = number;
type bool = boolean;

export interface AgentInfo {
  agentName: string;

  specialAbility: string | null;

  endurance: int;
  accuracy: int;
  strength: int;
  speed: int;

  modMeleeSkill: int;
  modGunSkill: int;
  modLeashes: int;
  modToughness: int;
  modVigilant: int;

  preventsMindControl: bool;
  cantChallengeToFight: bool;
  canChallengeToFight: bool;
  beast: bool;
  cantCannibalize: bool;
  dontLeavePost: bool;
  butlerBot: bool;
  inhuman: bool;
  dontChangeRelationships: bool;
  enforcer: bool;
  hackable: bool;
  copBot: bool;
  wontFlee: bool;
  ambientAudio: string | null;
  canTakeDrugs: bool;
  mustBeGuilty: bool;
  firefighter: bool;
  ghost: bool;
  hologram: bool;
  preventStatusEffects: bool;
  mustFlee: bool;
  isMayor: bool;
  canGoBetweenLevels: bool;
  mechFilled: bool;
  mechEmpty: bool;
  objectAgent: bool;
  killerRobot: bool;
  hasDangerMajorMinor: bool;
  dontStopForDanger: bool;
  originalWerewolf: bool;
  shirtless: bool;
  zombified: bool;

  startingHeadPiece: string | null;
  moneyTier: int;

  defaultGoal: string | null | string[];

  agentCategories: string[];
  desires: string[];
  traits: string[];
  items: [invItemName: string, count: number][];
  jobs: [jobName: string, number][];

  usesNewHead: bool;

  hairType: WeightedString;
  facialHairType: WeightedString;
  bodyType: WeightedString;
  eyesType: WeightedString;

  hairColor: WeightedString;
  facialHairColor: WeightedString;
  bodyColor: WeightedString;
  legsColor: WeightedString;
  skinColor: WeightedString;

  notes?: string[];
}

// "lines", "setupInitialCategories", "agentColorDirty"
