"use client";
import { useCallback, useLayoutEffect } from "react";

// eslint-disable-next-line no-undef
type WindowEvents = WindowEventMap;
// eslint-disable-next-line no-undef
type DocumentEvents = DocumentEventMap;

function useEvent(target: any, type: string, listener: Function, deps: React.DependencyList) {
  listener = useCallback(listener, deps);

  useLayoutEffect(() => {
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [type, listener]);
}

export function useWindowEvent<K extends keyof WindowEvents>(
  type: K,
  listener: (this: Window, ev: WindowEvents[K]) => any,
  deps: React.DependencyList,
) {
  useEvent(window, type, listener, deps);
}
export function useDocumentEvent<K extends keyof DocumentEvents>(
  type: K,
  listener: (this: Document, ev: DocumentEvents[K]) => any,
  deps: React.DependencyList,
) {
  useEvent(document, type, listener, deps);
}
