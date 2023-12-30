import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await fetch("https://oembed.com/providers.json", { next: { revalidate: 3600 } });
    const json = await data.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json([]);
  }
}
