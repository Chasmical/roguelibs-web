function pad2(num: number) {
  return num.toString().padStart(2, "0");
}
export function formatDate(date: Date | string | number) {
  if (typeof date !== "object") date = new Date(date);
  return [
    pad2(date.getDate()),
    ".",
    pad2(date.getMonth() + 1),
    ".",
    date.getFullYear(),
    ", ",
    pad2(date.getHours()),
    ":",
    pad2(date.getMinutes()),
    ":",
    pad2(date.getSeconds()),
  ].join("");
}
export function formatDateLocal(date: Date | string | number) {
  if (typeof date !== "object") date = new Date(date);
  return date.toLocaleString();
}
