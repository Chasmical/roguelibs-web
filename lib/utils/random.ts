import type { NonArray } from "@lib/types";

export function shuffle<T>(items: T[], end = 0) {
  for (let i = items.length - 1; i > end; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function sample<T>(array: T[], count?: null): T;
export function sample<T>(array: T[], count: number): T[];
export function sample<T>(array: T[], count?: number | null) {
  if (count == null) {
    return array[Math.floor(Math.random() * array.length)];
  }
  const unshuffledIndex = array.length - 1 - count;
  const copy = shuffle(array.slice(), unshuffledIndex);
  return copy.slice(unshuffledIndex + 1);
}

export type WeightedArray<T> = [item: T, weight: number][];
export type WeightedMap<T extends string> = Record<T, number>;

function isWeightedArray(array: unknown[]): array is WeightedArray<unknown> {
  const item = array[0];
  return Array.isArray(item) && item.length === 2 && typeof item[1] === "number";
}

export function weighted<T>(data: WeightedArray<T>): T;
export function weighted<T>(data: NonArray<T>[]): T;
export function weighted<T extends string>(data: { [N in T]: number }): T;
export function weighted<T>(
  data: WeightedArray<T> | NonArray<T>[] | (T extends string ? { [N in T]: number } : never),
): T;
export function weighted<T>(data: WeightedArray<T> | NonArray<T>[] | Record<string, number>): T | void {
  if (Array.isArray(data)) {
    if (!isWeightedArray(data)) return sample(data);
    data = Object.fromEntries(data) as Record<string, number>;
  }
  const total = Math.random() * Object.values<number>(data).reduce((a, b) => a + (+b || 0), 0);
  let sum = 0;

  for (const key in data) {
    sum += data[key];
    if (sum >= total) return key as T;
  }
}
