import { cache } from "react";
import { unzip } from "fflate";
import type { Unzipped } from "fflate";
import { produce } from "immer";

// There's no built-in solution to cache stuff in development mode, so we'll use this
const cache2 = <T>(func: () => Promise<T>): (() => Promise<T>) => {
  let promise: Promise<T>;
  return () => (promise ??= func());
};

export const cacheAlways = process.env.NODE_ENV !== "production" ? cache2 : cache;

export function fetchAsset(bucket: string, path: string, init?: RequestInit) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}?version=4`;
  return fetch(url, init);
}
export function fetchAssetJson<T>(bucket: string, path: string, init?: RequestInit): () => Promise<T>;
export function fetchAssetJson<T>(
  bucket: string,
  path: string,
  post: (data: T) => void,
  init?: RequestInit,
): () => Promise<T>;
export function fetchAssetJson<T>(
  bucket: string,
  path: string,
  postOrInit?: RequestInit | ((data: T) => T | void),
  init?: RequestInit,
) {
  const post = typeof postOrInit === "function" ? postOrInit : ((init = postOrInit), undefined);

  return cacheAlways(async () => {
    const res = await fetchAsset(bucket, path, init);
    const data = (await res.json()) as T;
    return post ? produce(data, d => void post(d as T)) : data;
  });
}
export function fetchAssetBundle(bucket: string, path: string, init?: RequestInit) {
  return cacheAlways(async () => {
    const res = await fetchAsset(bucket, path, init);
    const buffer = new Uint8Array(await res.arrayBuffer());
    return await new Promise<Unzipped>(resolve => {
      unzip(buffer, (_, data) => resolve(data));
    });
  });
}
