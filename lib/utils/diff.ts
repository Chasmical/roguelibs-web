export type DiffOptions<T> = T extends (infer E)[]
  ? ArrayDiffOptions<E>
  : T extends object
  ? ObjectDiffOptions<T>
  : never;

export type ObjectDiffOptions<T> = {
  [N in keyof T]?: T[N] extends (infer E)[]
    ? ArrayDiffOptions<E> | false
    : T[N] extends object
    ? ObjectDiffOptions<T[N]> | false
    : boolean;
};
export type ArrayDiffOptions<E> = { idBy?: keyof E | ((item: E) => string | number) } & ObjectDiffOptions<E>;

export default function diff<T>(
  left: T,
  right: T,
  opt?: DiffOptions<T>,
): DiffOptions<T> extends never ? null : string[] {
  if (Array.isArray(left) && Array.isArray(right)) {
    return diffArray(left, right, opt as ArrayDiffOptions<T>) as never;
  } else if (typeof left === "object" && left !== null && typeof right === "object" && right !== null) {
    return diffObject(left, right, opt as ObjectDiffOptions<T>) as never;
  }
  return null as never;
}
export function diffArray<T>(left: T[], right: T[], opt?: ArrayDiffOptions<T>): string[] {
  const differences: string[] = [];

  let idBy: (item: any) => any = opt?.idBy as any;
  if (typeof idBy !== "function") {
    const key: string = idBy ?? "id";
    idBy = item => item[key];
  }

  const leftIds = left.map(idBy);
  const rightIds = right.map(idBy);

  differences.push(...leftIds.filter(l => !rightIds.includes(l)).map(o => "-" + o));
  differences.push(...rightIds.filter(r => !leftIds.includes(r)).map(o => "+" + o));

  const bothIds = leftIds.filter(l => rightIds.includes(l));
  for (const itemId of bothIds) {
    const leftItem = left.find(l => idBy(l) === itemId);
    const rightItem = right.find(r => idBy(r) === itemId);
    const elementDiffs = diffObject(leftItem, rightItem, opt);
    differences.push(...elementDiffs.map(d => `${itemId}.${d}`));
  }

  return differences;
}
export function diffObject<T>(left: T, right: T, opt?: ObjectDiffOptions<T>): string[] {
  let differences: string[] = [];
  for (const key in left) {
    if (opt?.[key] === false) continue;
    const a = left[key];
    const b = right[key];
    if (Array.isArray(a) && Array.isArray(b)) {
      const arrayDiff = diffArray(a, b, opt?.[key] as ArrayDiffOptions<unknown>);
      differences.push(...arrayDiff.map(a => `${key}.${a}`));
      continue;
    }
    if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
      differences.push(...diffObject(a, b, opt?.[key] as ObjectDiffOptions<unknown>));
      continue;
    }
    if (a !== b) differences.push(key);
  }
  return differences;
}

export function structuralDiff<T>(
  left: T,
  right: T,
  opt?: DiffOptions<T>,
): DiffOptions<T> extends never ? null : Partial<T> {
  if (Array.isArray(left) && Array.isArray(right)) {
    return structuralDiffArray(left, right, opt as ArrayDiffOptions<T>) as never;
  } else if (typeof left === "object" && left !== null && typeof right === "object" && right !== null) {
    return structuralDiffObject(left, right, opt as ObjectDiffOptions<T>) as never;
  }
  return null as never;
}
export function structuralDiffArray<T>(left: T[], right: T[], opt?: ArrayDiffOptions<T>): Partial<T>[] {
  const key: keyof T = (opt?.idBy as keyof T) ?? "id";
  if (typeof key !== "string") {
    throw new Error("idBy must be a string in structural diff");
  }
  const idBy = (item: T) => item[key];

  const changes = right.map(r => {
    const id = idBy(r);
    const l = id != null ? left.find(l => idBy(l) === id) : undefined;
    opt && (opt[key] ??= true as any);
    return l != null ? structuralDiffObject(l, r, opt) : r;
  });

  return changes;
}
export function structuralDiffObject<T>(left: T, right: T, opt?: ObjectDiffOptions<T>): Partial<T> {
  let differences: Partial<T> = {};

  for (const key in left) {
    if (opt?.[key] === false) continue;
    const a = left[key];
    const b = right[key];

    if (Array.isArray(a) && Array.isArray(b)) {
      const arrayDiff = structuralDiffArray(a, b, opt?.[key] as ArrayDiffOptions<unknown>);
      differences[key] = arrayDiff as any;
      continue;
    }
    if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
      differences[key] = structuralDiffObject(a, b, opt?.[key] as ObjectDiffOptions<unknown>) as any;
      continue;
    }
    if (a !== b || opt?.[key] === true) differences[key] = b;
  }
  return differences;
}
