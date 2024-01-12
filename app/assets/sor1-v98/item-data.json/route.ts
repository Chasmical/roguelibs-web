import { NextResponse } from "next/server";
import getItemData from ".";

export async function GET() {
  const data = await getItemData();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=14400" },
  });
}
