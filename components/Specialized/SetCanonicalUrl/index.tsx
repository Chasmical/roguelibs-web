"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface SetCanonicalUrl {
  url: string;
}
export default function SetCanonicalUrl({ url }: SetCanonicalUrl) {
  const router = useRouter();
  useEffect(() => {
    if (location.pathname !== url) {
      router.replace(url + location.search + location.hash, { scroll: false });
    }
  }, []);
  return null;
}
