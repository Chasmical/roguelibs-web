import type { AgentData, AgentInfo, WeightedString } from "@app/assets/sor1-v98/agents.json";
import { weighted } from "@lib/utils/random";

function lookup(value: string, lookups: Record<string, string>[]) {
  function pass(value: string) {
    for (const lookup of lookups) {
      if (value in lookup) return lookup[value];
    }
  }
  let next = pass(value);
  while (next) next = pass((value = next));
  return value;
}
export function treeRandom(value: WeightedString, lookups: Record<string, WeightedString>[]) {
  function pass(value: WeightedString) {
    if (typeof value !== "string") return weighted(value);
    for (const lookup of lookups) {
      if (value in lookup) return lookup[value];
    }
  }
  let next = pass(value);
  while (next) next = pass((value = next));
  return value as string;
}

export default function select(data: AgentData, info: AgentInfo) {
  const baseline = data.baseline;
  const skinColor = treeRandom(info.skinColor ?? baseline.skinColor, [data.skinColors, data.colors]);
  let hairColor = treeRandom(info.hairColor ?? baseline.hairColor, [data.hairColors, data.colors]);

  if (
    [data.skinColors["BlackSkin"], data.skinColors["LightBlackSkin"]].includes(skinColor) &&
    hairColor !== "#787878"
  ) {
    const wildColorNames = Object.values(data.hairColors["WildColors"]);
    const wildColors = wildColorNames.map(n => lookup(n, [data.hairColors, data.colors] as any));
    if (!wildColors.includes(hairColor)) hairColor = data.colors["Black"] as string;
  }

  const hairType = treeRandom(info.hairType ?? baseline.hairType, [data.hairTypes]);
  const facialHairType = data.hairCanHaveFacialHair.includes(hairType)
    ? treeRandom(info.facialHairType, [data.facialHairTypes])
    : "None";

  return {
    hairType,
    facialHairType,
    hairColor,
    skinColor,
  };
}
