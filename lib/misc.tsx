import { DropResult } from "@hello-pangea/dnd";

export function reorder<T>(dnd: DropResult, container: T[], orderProp?: keyof T): T[];
export function reorder<T>(dnd: DropResult, containers: Record<string, T[]>, orderProp?: keyof T): Record<string, T[]>;
export function reorder<T>(dnd: DropResult, containers: T[] | Record<string, T[]>, orderProp?: keyof T) {
  if (!dnd.destination) return containers;

  if (Array.isArray(containers)) {
    let copy = containers.slice();
    const [removed] = copy.splice(dnd.source.index, 1);
    copy.splice(dnd.destination.index, 0, removed);

    if (orderProp != null) {
      copy = copy.map((item, order) => ({ ...item, [orderProp]: order }));
    }
    return copy;
  } else {
    let copyFrom = containers[dnd.source.droppableId].slice();
    const [removed] = copyFrom.splice(dnd.source.index, 1);
    let copyTo = containers[dnd.destination.droppableId].slice();
    copyTo.splice(dnd.destination.index, 0, removed);

    if (orderProp != null) {
      copyFrom = copyFrom.map((item, order) => ({ ...item, [orderProp]: order }));
      copyTo = copyTo.map((item, order) => ({ ...item, [orderProp]: order }));
    }
    return {
      ...containers,
      [dnd.source.droppableId]: copyFrom,
      [dnd.destination.droppableId]: copyTo,
    };
  }
}

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
    : false;
};
export type ArrayDiffOptions<E> = { idBy: keyof E | ((item: E) => string | number) } & ObjectDiffOptions<E>;

export function diff<T>(left: T, right: T, opt?: DiffOptions<T>): DiffOptions<T> extends never ? null : string[] {
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

export function triggerDownload(document: Document, data: Blob | string, filename: string) {
  const url = typeof data === "string" ? data : URL.createObjectURL(data);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.target = "_blank";

  document.body.appendChild(link);
  link.click();
  link.parentNode!.removeChild(link);
}

function pad2(num: number) {
  return num.toString().padStart(2, "0");
}
export function formatDate(date: Date | string | number) {
  if (typeof date !== "object") date = new Date(date);
  return [
    " ",
    pad2(date.getHours()),
    ":",
    pad2(date.getMinutes()),
    ", ",
    pad2(date.getDate()),
    ".",
    pad2(date.getMonth() + 1),
    ".",
    date.getFullYear(),
  ].join("");
}
export function formatDateLocal(date: Date | string | number) {
  if (typeof date !== "object") date = new Date(date);
  return date.toLocaleString();
}
