import { createServerApi, createServiceApi } from "@lib/API";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DbUpload, DbUploadType } from "@lib/Database";
import md5 from "md5";

export async function POST(request: NextRequest) {
  const api = createServerApi({ cookies });
  const serviceApi = createServiceApi("SERVICE_ROLE_API");

  const session = await api.getSession();
  const myUser = session?.user.id ? await api.fetchUserById(session.user.id).catch(() => null) : null;

  if (!myUser) {
    return NextResponse.json({ error: "You're not authenticated." }, { status: 401 });
  }

  const form = await request.formData();

  const filename = form.get("filename");
  if (typeof filename !== "string") {
    return NextResponse.json({ error: `You must send a string in the "filename" entry.` }, { status: 400 });
  }
  const uploadFile = form.get("data");
  if (!(uploadFile instanceof File)) {
    return NextResponse.json({ error: `You must send a file in the "data" entry.` }, { status: 400 });
  }

  const buffer = Buffer.from(await uploadFile.arrayBuffer());
  const size = buffer.byteLength;
  const hash = md5(buffer);

  const insertRes = await serviceApi.Supabase.from("uploads")
    .insert({ type: DbUploadType.Hosted, filename, data: null, hash, size, uploadedBy: myUser.id } as Partial<DbUpload>)
    .select()
    .single();

  if (insertRes.error) {
    return NextResponse.json({ error: insertRes.error.message }, { status: 500 });
  }

  const upload = insertRes.data as DbUpload;
  const uploadRes = await serviceApi.Supabase.storage
    .from("uploads")
    .upload("" + upload.id, buffer, { contentType: "application/octet-stream", cacheControl: "31536000" });

  if (uploadRes.error) {
    return NextResponse.json({ error: uploadRes.error.message }, { status: 500 });
  }

  return NextResponse.json(upload, { status: 200 });
}
