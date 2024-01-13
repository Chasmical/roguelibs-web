import { fetchLocale } from "@app/assets/sor1-v98/locale";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

interface RouteInfo {
  params: { locale: string };
}
export async function GET(request: NextRequest, { params: { locale } }: RouteInfo) {
  const [code, ext] = locale.toLowerCase().split(".");
  if (ext !== "json") notFound();

  const data = await fetchLocale(code);
  if (!data) notFound();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=14400",
      "Content-Disposition": `inline; filename="${locale}"`,
    },
  });
}
