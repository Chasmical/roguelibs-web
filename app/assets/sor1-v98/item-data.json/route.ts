import { NextResponse } from "next/server";
import { fetchItemData } from ".";

export async function GET() {
  const data = await fetchItemData();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=14400" },
  });
}
