"use client";
import { useEffect } from "react";

export default function MdxPreviewIndexClient({ children }: React.PropsWithChildren) {
  useEffect(() => {
    window.top!.postMessage({ type: "iframeHeight", height: document.documentElement.scrollHeight }, "*");
  });
  return children;
}
