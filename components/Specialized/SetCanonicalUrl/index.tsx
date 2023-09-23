"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export interface SetCanonicalUrl {
  url: string;
}
export default function SetCanonicalUrl({ url }: SetCanonicalUrl) {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const paramsStr = params.toString();
    router.replace(url + (paramsStr ? "?" + paramsStr : ""), { scroll: false });
  }, []);
  return null;
}
