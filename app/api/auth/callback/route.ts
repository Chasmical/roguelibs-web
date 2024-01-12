import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { attempt } from "@lib/utils/misc";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let then = attempt(() => decodeURIComponent(requestUrl.searchParams.get("then") ?? "")) ?? "";
  if (!then.startsWith("/")) then = "/" + then;

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  const url = new URL(request.nextUrl.origin + then);
  return NextResponse.redirect(url);
}
