import { cookies } from "next/headers";
import { createServerApi, createServiceApi, RestMod, RestModAuthor, RestUser } from "@lib/API";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const api = createServerApi({ cookies });
  const serviceApi = createServiceApi("SERVICE_ROLE_API");

  const body = (await request.json()) as Partial<RestMod>;

  const id = Number(body.id);

  const session = await api.getSession();
  const [prevMod, myUser] = await Promise.all([
    serviceApi.fetchModById(id).catch(() => null),
    session?.user.id ? api.fetchUserById(session.user.id).catch(() => null) : null,
  ]);

  function canEdit() {
    return prevMod?.authors.some(a => a.user_id === myUser?.id && a.can_edit);
  }
  if (!prevMod || !myUser || !(canEdit() || myUser.is_admin)) {
    return NextResponse.json({ error: "You're not authorized to edit this mod." }, { status: 403 });
  }

  const promises: PromiseLike<any>[] = [];

  // ===== Create and await database requests

  const changes: Partial<RestMod> = {
    id: body.id,
    banner_layout: body.banner_layout,
    banner_url: body.banner_url,
    card_banner_layout: body.card_banner_layout,
    card_banner_url: body.card_banner_url,
    card_description: body.card_description,
    description: body.description,
    gamebanana_id: body.gamebanana_id,
    github_repo: body.github_repo,
    guid: body.guid,
    is_public: body.is_public,
    slug: body.slug,
    title: body.title,
    website_link: body.website_link,
    edited_at: new Date().toISOString(),

    is_verified: body.is_verified,
    // created_at: body.created_at,
    // nugget_count: body.nugget_count,
    // subscription_count: body.subscription_count,
  };
  if (changes.is_verified !== undefined && !myUser.is_admin) {
    return NextResponse.json({ error: "You're not authorized to change is_verified property." }, { status: 403 });
  }

  promises.push(serviceApi.Supabase.from("mods").update([changes]).eq("id", id).select());

  const newAuthors = body.authors?.map(author => {
    const prev = prevMod.authors.find(a => a.id === author.id);
    return {
      id: prev?.id,
      user_id: author.user_id ?? prev?.user_id,
      mod_id: id,
      // permissions are checked in verifyAuthorPermissions()
      is_creator: author.is_creator,
      can_edit: author.can_edit,
      can_see: author.can_see,
      credit: author.credit,
      order: author.order,
      edited_at: new Date().toISOString(),
    } as Partial<RestModAuthor> & { user_id: string };
  });

  if (newAuthors) {
    const res = verifyAuthorPermissions(prevMod.authors, newAuthors, myUser, id);
    if (!("deletedAuthors" in res)) return res;

    const { addedAuthors, updatedAuthors, deletedAuthors } = res;
    if (addedAuthors.length) {
      promises.push(serviceApi.Supabase.from("mod_authors").insert(addedAuthors, { defaultToNull: false }).select());
    }
    if (updatedAuthors.length) {
      promises.push(serviceApi.Supabase.from("mod_authors").upsert(updatedAuthors, { defaultToNull: false }).select());
    }
    if (deletedAuthors.length) {
      promises.push(serviceApi.Supabase.from("mod_authors").delete().in("id", deletedAuthors).select());
    }
  }

  await Promise.all(promises);

  // ===== Return new mod

  const newMod = await serviceApi.fetchModById(id);

  return NextResponse.json(newMod, { status: 200 });
}

function verifyAuthorPermissions(
  prevAuthors: RestModAuthor[],
  newAuthors: (Partial<RestModAuthor> & { user_id: string })[],
  myUser: RestUser,
  mod_id: number,
) {
  // ===== Sanitize permissions and coerce them to booleans
  function coerceBool(value: any) {
    return `${value}` === "true" ? true : `${value}` === "false" ? false : undefined;
  }
  for (const newAuthor of newAuthors) {
    newAuthor.is_creator = coerceBool(newAuthor.is_creator);
    newAuthor.can_edit = coerceBool(newAuthor.can_edit);
    newAuthor.can_see = coerceBool(newAuthor.can_see);
  }

  const myAuthor = prevAuthors.find(a => a.user_id === myUser.id);

  const deletedAuthors = prevAuthors.filter(a => !newAuthors.some(b => a.user_id === b.user_id));
  const updatedAuthors = newAuthors.filter(a => prevAuthors.some(b => a.user_id === b.user_id));
  const addedAuthors = newAuthors.filter(a => !prevAuthors.some(b => a.user_id === b.user_id));

  // ===== Permission checks on delete/insert/update

  for (const deletedAuthor of deletedAuthors) {
    // allow removing yourself from the authors
    if (deletedAuthor.user_id === myUser.id) continue;

    if (deletedAuthor.is_creator) {
      // only admins can remove creators
      if (myUser.is_admin) continue;
      return NextResponse.json(
        { error: `You're not authorized to remove user ${deletedAuthor.user_id} from authors.` },
        { status: 403 },
      );
    }
    if (deletedAuthor.can_edit) {
      // only admins and creators can remove editors
      if (myUser.is_admin || myAuthor?.is_creator) continue;
      return NextResponse.json(
        { error: `You're not authorized to remove user ${deletedAuthor.user_id} from authors.` },
        { status: 403 },
      );
    }
  }
  for (const addedAuthor of addedAuthors) {
    if (addedAuthor.is_creator) {
      // only admins and creators can add creators
      if (myUser.is_admin || myAuthor?.is_creator) continue;
      return NextResponse.json(
        { error: `You're not authorized to add user ${addedAuthor.user_id} to authors with creator permissions.` },
        { status: 403 },
      );
    }
    if (addedAuthor.can_edit) {
      // only admins and creators can add editors
      if (myUser.is_admin || myAuthor?.is_creator) continue;
      return NextResponse.json(
        { error: `You're not authorized to add user ${addedAuthor.user_id} to authors with editing permissions.` },
        { status: 403 },
      );
    }
    addedAuthor.mod_id = mod_id;
  }
  for (const updatedAuthor of updatedAuthors) {
    if (updatedAuthor.is_creator !== undefined) {
      // admins and creators can update creator permissions
      if (myUser.is_admin || myAuthor?.is_creator) continue;
      // allow removing your own creator permissions
      if (updatedAuthor.is_creator === false && myAuthor?.user_id === myUser.id) continue;
      return NextResponse.json(
        { error: `You're not authorized to change creator permissions of user ${updatedAuthor.user_id}.` },
        { status: 403 },
      );
    }
    if (updatedAuthor.can_edit !== undefined) {
      // admins and creators can update editing permissions
      if (myUser.is_admin || myAuthor?.is_creator) continue;
      // allow removing your own editing permissions
      if (updatedAuthor.can_edit === false && myAuthor?.user_id === myUser.id) continue;
      return NextResponse.json(
        { error: `You're not authorized to change editing permissions of user ${updatedAuthor.user_id}.` },
        { status: 403 },
      );
    }
    delete updatedAuthor.mod_id;
  }

  // ===== Permission level checks

  // creators automatically get editing and viewing permissions
  // editors automatically get viewing permissions
  for (const addedAuthor of addedAuthors) {
    addedAuthor.is_creator && (addedAuthor.can_edit = true);
    addedAuthor.can_edit && (addedAuthor.can_see = true);
  }
  for (const updatedAuthor of updatedAuthors) {
    updatedAuthor.is_creator && (updatedAuthor.can_edit = true);
    updatedAuthor.can_edit && (updatedAuthor.can_see = true);
  }

  // ===== Creator check

  const prevCreators = prevAuthors.filter(a => a.is_creator).length;
  const removedCreators =
    deletedAuthors.filter(a => a.is_creator).length + updatedAuthors.filter(a => a.is_creator === false).length;
  const newCreators =
    addedAuthors.filter(a => a.is_creator).length + updatedAuthors.filter(a => a.is_creator === true).length;

  const creatorCount = prevCreators - removedCreators + newCreators;
  if (creatorCount !== 1) {
    return NextResponse.json({ error: `A mod must have only one author with creator permissions.` }, { status: 403 });
  }

  return {
    deletedAuthors: deletedAuthors.map(a => a.id),
    updatedAuthors,
    addedAuthors,
  };
}
