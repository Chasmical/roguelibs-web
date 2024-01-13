import { fetchLocale } from "@app/assets/sor1-v98/locale";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

interface RouteInfo {
  params: { locale: string; category: string };
}
export async function GET(request: NextRequest, { params: { locale, category } }: RouteInfo) {
  const [categoryName, ext] = category.split(".");
  if (ext !== "json") notFound();

  const data = await fetchLocale(locale);
  if (!data) notFound();

  const categoryData = data.Categories[categoryName];
  if (!categoryData) notFound();

  return NextResponse.json(categoryData, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="${locale}.${category}"`,
    },
  });
}
