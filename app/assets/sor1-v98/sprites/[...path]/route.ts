import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { fetchAssetBundle } from "@lib/utils/fetch";

const assetBundleMap = {
  Items: fetchAssetBundle("assets", "Items.zip"),
  Bodies: fetchAssetBundle("assets", "Bodies.zip"),
};

interface RouteInfo {
  params: { path: string[] };
}

export async function GET(request: NextRequest, { params: { path } }: RouteInfo) {
  const [bundleName, assetPath] = path.join("/").split("/", 2);
  const assetName = path.at(-1);

  const bundlePromise = (assetBundleMap as any)[bundleName];
  if (!bundlePromise) notFound();

  const bundle = await bundlePromise();
  const asset = bundle[assetPath];
  if (!asset) notFound();

  return new NextResponse(asset, {
    headers: {
      "Cache-Control": "public, max-age=14400",
      "Content-Type": "image/png",
      "Content-Length": "" + asset.byteLength,
      "Content-Disposition": `inline; filename="${assetName}"`,
    },
  });
}
