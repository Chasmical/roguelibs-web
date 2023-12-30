import { cookies } from "next/headers";
import { createServerApi, createServiceApi } from "@lib/API";
import { NextRequest, NextResponse } from "next/server";

interface RouteInfo {
  params: { mod_slug: string };
}
export async function PATCH(req: NextRequest, { params: { mod_slug } }: RouteInfo) {
  const body: unknown = await req.json();

  const api = createServerApi({ cookies });
  const service = createServiceApi("SERVICE_ROLE_API");
  const session = await api.getSession();
  if (!session) {
    return NextResponse.json({ error: "You're not authenticated." }, { status: 401 });
  }

  const [prevMod, myUser] = await Promise.all([
    service.fetchModBySlug(mod_slug).catch(() => null),
    service.fetchUserById(session.user.id).catch(() => null),
  ]);

  function canEdit() {
    return myUser?.is_admin || prevMod?.authors.some(a => a.user_id === myUser?.id && a.can_edit);
  }
  if (!prevMod || !myUser || !canEdit()) {
    return NextResponse.json({ error: "You're not authorized to edit this mod." }, { status: 403 });
  }
}
