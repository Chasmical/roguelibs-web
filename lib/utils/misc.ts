export function attempt<T>(action: () => T): T | undefined {
  try {
    return action();
  } catch {}
}

export function rentObjectURL(data: Blob | MediaSource, timeoutMs: number) {
  const url = URL.createObjectURL(data);
  setTimeout(() => URL.revokeObjectURL(url), timeoutMs);
  return url;
}

export function triggerDownload(document: Document, dataOrUrl: Blob | string, filename: string) {
  const url = typeof dataOrUrl === "string" ? dataOrUrl : rentObjectURL(dataOrUrl, 30 * 1000);

  const link = document.createElement("a");
  Object.assign(link, { href: url, download: filename, rel: "noopener" });

  document.body.appendChild(link);
  link.click();
  link.parentNode!.removeChild(link);
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
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash;
}
