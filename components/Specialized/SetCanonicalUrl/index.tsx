"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface SetCanonicalUrl {
  url: string;
}
export default function SetCanonicalUrl({ url }: SetCanonicalUrl) {
  const router = useRouter();
  useEffect(() => router.replace(url), []);
  return null;
}
