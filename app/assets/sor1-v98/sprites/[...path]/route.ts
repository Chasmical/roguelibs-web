import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({});

  // return new NextResponse(file, {
  //   headers: {
  //     "Cache-Control": "public, max-age=31536000, immutable",
  //     "Content-Type": "image/png",
  //   },
  // });
}
