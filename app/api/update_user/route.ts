import { cookies } from "next/headers";
import { createServerApi, createServiceApi, RestUser } from "@lib/API";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const api = createServerApi({ cookies });
  const serviceApi = createServiceApi("SERVICE_ROLE_API");

  const body = (await request.json()) as Partial<RestUser>;

  const id = String(body.id);

  const session = await api.getSession();
  const [prevUser, myUser] = await Promise.all([
    serviceApi.fetchUserById(id).catch(() => null),
    session?.user.id ? api.fetchUserById(session.user.id).catch(() => null) : null,
  ]);

  if (!prevUser || !myUser || !(prevUser.id === myUser.id || myUser.is_admin)) {
    return NextResponse.json({ error: "You're not authorized to edit this profile." }, { status: 403 });
  }

  const promises: PromiseLike<any>[] = [];

  // ===== Create and await database requests

  const changes: Partial<RestUser> = {
    id: body.id,
    username: body.username,
    avatar_url: body.avatar_url,
    discord_id: body.discord_id,
    slug: body.slug,
    edited_at: new Date().toISOString(),
  };

  promises.push(serviceApi.Supabase.from("users").update([changes]).eq("id", id).select());

  await Promise.all(promises);

  // ===== Return new user

  const newUser = await serviceApi.fetchUserById(id);

  return NextResponse.json(newUser, { status: 200 });
}
