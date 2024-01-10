import { useMemo, useSyncExternalStore } from "react";

export default function useLocalStorage(key: string | null | undefined) {
  const slot = useMemo(() => createStorageSlot(key), [key]);
  const value = useSyncExternalStore(slot.listen, slot.get, () => undefined);
  return [value, slot.set] as const;
}

export interface StorageSlot {
  readonly get: () => string | null | undefined;
  readonly set: (newValue: string | null | undefined) => void;
  readonly listen: (onChange: () => void) => () => void;
}

const noopStorageSlot: StorageSlot = {
  get: () => undefined,
  set: () => {},
  listen: () => () => {},
};

export function createStorageSlot(key: string | null | undefined): StorageSlot {
  if (typeof window === "undefined") {
    const throwError = (): never => {
      throw new Error("Cannot use localStorage on the server!");
    };
    return { get: throwError, set: throwError, listen: throwError };
  }
  if (!key) return noopStorageSlot;

  const storageArea = window.localStorage;

  return {
    get: () => {
      return storageArea.getItem(key);
    },
    set: newValue => {
      newValue = newValue == null ? null : "" + newValue;
      const oldValue = storageArea.getItem(key);
      if (oldValue === newValue) return;
      newValue === null ? storageArea.removeItem(key) : storageArea.setItem(key, newValue);
      // default "storage" event is sent only if the storage was modified in **other** tabs
      window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue, storageArea }));
    },
    listen: onChange => {
      const listener = (event: StorageEvent) => {
        event.storageArea === storageArea && event.key === key && onChange();
      };
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    },
  };
}
