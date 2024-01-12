import { fetchAssetJson } from "@lib/utils/fetch";

export default function getItemData() {
  return fetchAssetJson<ItemInfo>("assets", "item-data.json");
}

export interface ItemInfo {
  baseline: Partial<Item>;
  entries: Partial<Item>[];
}

type ItemType =
  | "Food"
  | "Combine"
  | "Tool"
  | "Wearable"
  | "WeaponThrown"
  | "NonItem"
  | "WeaponProjectile"
  | "Consumable"
  | "WeaponMelee"
  | "Readable"
  | "Nugget"
  | "Money"
  | "Junk";
type WeaponCode = "None" | "WeaponProjectile" | "WeaponThrown" | "WeaponMelee";
type ArmorDepletionType = "MeleeAttack" | "Bullet" | "Everything" | "FireAndEverything";
type HitSoundType = "Normal" | "Cut";

type StatusEffectName = string;
type SpriteName = string;
type AgentName = string;

type float = number;
type int = number;
type bool = boolean;

export interface Item {
  accuracyMod: int;
  armorDepletionType: ArmorDepletionType | null;
  behindHair: bool;
  canBeUsedOnComputer: bool;
  canBeUsedOnDoor: bool;
  canBeUsedOnSafe: bool;
  canBeUsedOnWindow: bool;
  canCatchFire: bool;
  canFix: bool;
  canHaveStartingOwner: bool;
  canRepeatInShop: bool;
  cantBeCloned: bool;
  cantDrop: bool;
  cantDropSpecificCharacter: AgentName | null;
  cantShowHair: bool;
  cantShowHairAtAll: bool;
  cantStoreInATMMachine: bool;
  Categories: string[];
  chanceToWear: int;
  characterExclusive: bool;
  characterExclusiveSpecificCharacter: AgentName | null;
  contents: string[];
  destroyAtLevelEnd: bool;
  doesNoDamage: bool;
  dontAutomaticallySelect: bool;
  dontFlash: bool;
  dontSelectNPC: bool;
  doSpill: bool;
  enduranceMod: int;
  goesInToolbar: bool;
  gunKnockback: int;
  hasCharges: bool;
  healthChange: int;
  hierarchy2: float;
  hierarchy: float;
  hitSoundType: HitSoundType | null;
  incendiaryDamage: bool;
  initCount: int;
  initCountAI: int;
  invItemName: string;
  isArmor: bool;
  isArmorHead: bool;
  isKey: bool;
  isSafeCombination: bool;
  isWeapon: bool;
  itemType: ItemType | null;
  itemValue: int;
  longerRapidFire: bool;
  lowCountThreshold: int;
  maxAmmo: int;
  meleeDamage: int;
  meleeNoHit: bool;
  noCountText: bool;
  nonLethal: bool;
  nonStackableInShop: bool;
  noRefills: bool;
  noShadow: bool;
  noSoundOnAgentHit: bool;
  notInLoadoutMachine: bool;
  otherDamage: int;
  permanentHeadPiece: bool;
  questItem: bool;
  questItemCanBuy: bool;
  rapidFire: bool;
  reactOnTouch: bool;
  rechargeAmount: int;
  rechargeAmountInverse: int;
  rewardCount: int;
  shadowOffset: int;
  shortRangeProjectile: bool;
  specialDamage: bool;
  specialMeleeTexture: bool;
  speedMod: int;
  spriteName: SpriteName | null;
  stackable: bool;
  stackableContents: bool;
  statusEffect: StatusEffectName | null;
  strengthMod: int;
  thiefCantSteal: bool;
  throwDamage: int;
  throwDistance: int;
  throwExtraDist: bool;
  touchDamage: int;
  weaponCode: WeaponCode;
  weaponToBeLoaded: bool;

  notes?: string[];
}
