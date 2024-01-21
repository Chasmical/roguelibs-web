import { fetchAssetJson } from "@lib/utils/fetch";
import { WeightedArray, WeightedMap } from "@lib/utils/random";

export const fetchAgentData = fetchAssetJson<AgentData>("assets", "agents.json", data => {
  [data.baseline, ...data.entries].forEach(e => {
    delete e.lines;
    delete e.notes;
  });
});

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
  usesNewHead: bool;

  ambientAudio: string | null;
  startingHeadPiece: string | null;
  moneyTier: int;

  defaultGoal: string | string[] | null;

  agentCategories: string[];
  desires: string[];
  traits: string[];
  items: [invItemName: string, count: int][];
  jobs: [jobName: string, int][];

  headType: string;
  hairType: WeightedString;
  facialHairType: WeightedString;
  bodyType: WeightedString;
  eyesType: WeightedString;

  hairColor: WeightedString;
  eyesColor: WeightedString;
  facialHairColor: WeightedString;
  bodyColor: WeightedString;
  legsColor: WeightedString;
  skinColor: WeightedString;

  lines?: string[];
  notes?: string[];
}
