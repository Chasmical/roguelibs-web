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
