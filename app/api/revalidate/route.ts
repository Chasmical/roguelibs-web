import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createServerApi } from "@lib/API";

export async function POST(request: NextRequest) {
  const api = createServerApi({ cookies });

  const session = await api.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await api.fetchUserById(session?.user.id);
  if (!user?.is_admin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ error: "Missing tag query parameter." }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({ success: true });
}
