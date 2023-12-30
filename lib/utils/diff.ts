import { RestMod } from "@lib/API";
export type IsAny<Type> = 0 extends 1 & Type ? true : false;
export type IsUnknown<Type> = IsAny<Type> extends true ? false : unknown extends Type ? true : false;

type DiffOptionsNonFalse<T> = T extends (infer E)[]
  ? ArrayDiffOptions<E>
  : T extends object
    ? ObjectDiffOptions<T>
    : never;

export type DiffOptions<T> = DiffOptionsNonFalse<T> | false;

export type ObjectDiffOptions<T extends object> = { [N in keyof T]?: DiffOptions<T[N]> };
export type ArrayDiffOptions<T> = DiffOptionsNonFalse<T> & { idBy?: keyof T };

type DiffDefined<T, O extends DiffOptions<T>> = T extends (infer E)[]
  ? O extends ArrayDiffOptions<E>
    ? ArrayDiff<E, O>
    : never
  : T extends object
    ? O extends ObjectDiffOptions<T>
      ? ObjectDiff<T, O>
      : never
    : T;

export type Diff<T, O extends DiffOptions<T>> = IsAny<O> extends true
  ? DiffDefined<T, DiffOptions<T>> | undefined
  : DiffDefined<T, O> | undefined;

type CoerceDiff<T, O> = IsUnknown<O> extends true ? Diff<T, any> : Diff<T, O extends DiffOptions<T> ? O : any>;
export type ObjectDiff<T extends object, O extends ObjectDiffOptions<T> = {}> = {
  [N in keyof T]?: [O[N]] extends [false] ? undefined : CoerceDiff<T[N], O[N]>;
};
export type ArrayDiff<T, O extends ArrayDiffOptions<T>> = Diff<T, O>[];

export function diff<T, O extends DiffOptions<T> = DiffOptions<T>>(left: T, right: T, opt?: O): Diff<T, O> {
  if (opt === false) return undefined!;
  if (Array.isArray(left) && Array.isArray(right)) {
    return diffArray(left, right, opt) as never;
  }
  if (left && typeof left === "object" && right && typeof right === "object") {
    return diffObject(left, right, opt as ObjectDiffOptions<any>) as never;
  }
  return (left === right ? undefined : right) as never;
}

function diffObject<T extends object, O extends ObjectDiffOptions<T> = ObjectDiffOptions<T>>(
  left: T,
  right: T,
  opt?: O,
): ObjectDiff<T, O> | undefined {
  let hasActualChanges = false;
  const res: ObjectDiff<T, O> = {};

  for (const key in left) {
    if (opt?.[key] === false) continue;
    const a = left[key];
    const b = right[key];
    const subdiff = diff(a, b, opt?.[key] as never);
    if (subdiff !== undefined) {
      hasActualChanges = true;
      res[key] = subdiff as never;
    }
  }

  return hasActualChanges ? res : undefined;
}

function diffArray<T, O extends ArrayDiffOptions<T> = ArrayDiffOptions<T>>(
  left: T[],
  right: T[],
  opt?: O,
): ArrayDiff<T, O> | undefined {
  const key = opt?.idBy ?? ("id" as keyof T);
  const idBy = (item: T) => item[key];

  let hasActualChanges = false;
  const res: ArrayDiff<T, O> = [];

  for (const b of right) {
    const id = idBy(b);
    const a = left.find(l => idBy(l) === id);
    const change = diff(a, b, opt);
    if (change) hasActualChanges = true;
    res.push({ ...change, [key]: id });
  }

  return hasActualChanges ? res : undefined;
}

export function applySafe<T>(a: T, b: Partial<T> | undefined): T {
  if (b === undefined) return a;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return a;

    const idBy = (item: any) => item.id;

    const array: unknown[] = b.map(item => {
      const id = idBy(item);
      const prev = a.find(i => idBy(i) === id);
      return prev ? applySafe(prev, item) : item;
    });

    return array as T;
  } else if (typeof a === "object" && a !== null) {
    if (typeof b !== "object" || b === null) return a;

    const clone: T = { ...a };
    for (const key in a) {
      clone[key] = applySafe<T[any]>(a[key], b[key]);
    }
    return clone;
  }
  return b as T;
}
