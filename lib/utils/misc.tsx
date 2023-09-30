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

export function arrayToggle<T>(array: T[], value: T, state?: boolean | null): void;
export function arrayToggle<T, C extends { [N in K]: T[] }, K extends keyof C>(
  obj: C,
  key: K,
  value: T,
  state?: boolean | null,
): void;
export function arrayToggle(...args: any[]) {
  if (!Array.isArray(args[0])) {
    const [obj, key] = args;
    args[1] = obj[key] = obj[key].slice();
    args.shift();
  }
  (arrayToggleMutable as Function)(...args);
}
function arrayToggleMutable<T>(array: T[], value: T, state?: boolean | null) {
  if (state === true) {
    array.includes(value) || array.push(value);
  } else {
    const index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
    } else {
      state == null && array.push(value);
    }
  }
}

export function selectWithUid<T>(uid: string | number, choices: T[]) {
  if (typeof uid === "string") uid = fastHash(uid);
  if (uid < 0) uid = uid + 2147483648;
  return choices[uid % choices.length];
}

export function fastHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
