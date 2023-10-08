import { cookies } from "next/headers";
import { createServerApi, createServiceApi, RestUser } from "@lib/API";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const api = createServerApi({ cookies });
  const serviceApi = createServiceApi("SERVICE_ROLE_API");

  const body = (await request.json()) as Partial<RestUser>;

  const changes: Partial<RestUser> = {
    id: body.id,
    username: body.username,
    avatar_url: body.avatar_url,
    discord_id: body.discord_id,
    slug: body.slug,
    edited_at: new Date().toISOString(),
  };

  const session = await api.getSession();
  const [original, myUser] = await Promise.all([
    serviceApi.fetchUserById(changes.id!).catch(() => null),
    session?.user.id ? api.fetchUserById(session.user.id).catch(() => null) : null,
  ]);

  if (!original || !(original.id === myUser?.id || myUser?.is_admin)) {
    return NextResponse.json({ error: "You're not authorized to edit this profile." }, { status: 403 });
  }

  const promises: PromiseLike<any>[] = [];

  // ===== Create and await database requests

  promises.push(serviceApi.Supabase.from("users").update([changes]).eq("id", changes.id).select());

  const data = await Promise.all(promises);

  // ===== Return new user

  const newUser = await serviceApi.fetchUserById(changes.id!);

  return NextResponse.json(newUser, { status: 200 });
}
