import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface RouteInfo {
  params: { slug: string };
}
export async function GET(request: NextRequest, { params: { slug } }: RouteInfo) {
  const supabase = createRouteHandlerClient({ cookies });

  const builder = supabase.from("users").select("*");

  if (slug === "@me") {
    const session = await supabase.auth.getSession();
    if (session.error || !session.data.session) {
      return new NextResponse(undefined, { status: 401 });
    }
    builder.eq("id", session.data.session.user.id);
  } else if (uuidv4Regex.test(slug)) {
    builder.eq("id", slug);
  } else {
    builder.eq("slug", slug);
  }

  const res = await builder.maybeSingle();
  if (res.error) notFound();
  const user = res.data;

  return NextResponse.json(user);
}

const uuidv4Regex = /^[\da-fA-F]{8}-([\da-fA-F]{4}-){3}[\da-fA-F]{12}$/;
