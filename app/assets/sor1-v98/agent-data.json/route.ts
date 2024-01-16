import { NextResponse } from "next/server";
import { fetchAgentData } from ".";

export async function GET() {
  const data = await fetchAgentData();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=14400" },
  });
}
