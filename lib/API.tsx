import { createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient, createClient as createSupabaseClient } from "@supabase/supabase-js";
import { DbMod, DbModAuthor, DbRelease, DbReleaseFile, DbUser } from "./Database";
import { WrappedSupabaseClient, from } from "./API.Statement";

export { useApi, ApiProvider, type ApiProviderProps } from "./API.Hooks";

export interface RestUser extends DbUser {
  nuggets: number[];
}

export interface RestMod extends DbMod {
  authors: RestModAuthor[];
}
export interface RestModWithReleases extends RestMod {
  releases: RestRelease[];
}
export interface RestModAuthor extends DbModAuthor {
  user: RestUser;
}

export interface RestRelease extends DbRelease {
  files: RestReleaseFile[];
}
export interface RestReleaseWithMod extends RestRelease {
  mod: RestMod;
}
export interface RestReleaseFile extends DbReleaseFile {}

//

//

const selectUser = from("users").select<RestUser>("*", {
  nuggets: "get_user_nuggets",
});

const selectModAuthor = from("mod_authors").select<RestModAuthor>({
  user: selectUser,
});
const selectMod = from("mods").select<RestMod>({
  authors: selectModAuthor.multiple,
});

const selectReleaseFile = from("release_files").select<RestReleaseFile>({});
const selectRelease = from("releases").select<RestRelease>({
  files: selectReleaseFile.multiple,
});

const selectReleaseWithMod = from("releases").select<RestReleaseWithMod>({
  files: selectReleaseFile.multiple,
  mod: selectMod,
});
const selectModWithReleases = from("mods").select<RestModWithReleases>({
  authors: selectModAuthor.multiple,
  releases: selectRelease.multiple,
});

//

//

export class RogueLibsApi extends WrappedSupabaseClient {
  public constructor(Supabase: SupabaseClient, currentUser: RestUser | null) {
    super(Supabase);
    this.currentUser = currentUser;
  }

  currentUser: RestUser | null = null;

  public fetchModById(id: number) {
    return this.selectOne(selectMod, m => m.eq("id", id));
  }
  public fetchModBySlug(slug: string | number) {
    if (!Number.isNaN(+slug)) return this.fetchModById(+slug);
    return this.selectOne(selectMod, r => r.eq("slug", slug));
  }

  public fetchModWithReleasesById(id: number) {
    return this.selectOne(selectModWithReleases, m => m.eq("id", id));
  }
  public fetchModWithReleasesBySlug(slug: string | number) {
    if (!Number.isNaN(+slug)) return this.fetchModWithReleasesById(+slug);
    return this.selectOne(selectModWithReleases, m => m.eq("slug", slug));
  }

  public fetchReleaseById(id: number) {
    return this.selectOne(selectReleaseWithMod, r => r.eq("id", id));
  }
  public fetchReleaseBySlug(mod_slug: string | number, release_slug: string | number) {
    if (!Number.isNaN(+release_slug)) return this.fetchReleaseById(+release_slug);
    return this.selectOne(selectReleaseWithMod, r => {
      r.eq(Number.isNaN(+mod_slug) ? "mod.slug" : "id", mod_slug).eq("slug", release_slug);
    });
  }

  public fetchReleasesByModId(mod_id: number) {
    return this.selectMany(selectRelease, r => r.eq("mod_id", mod_id));
  }

  public fetchUserById(user_id: string) {
    return this.selectOne(selectUser, u => u.eq("id", user_id));
  }

  public setModNugget(mod_id: number, nugget: boolean) {
    return this.rpc("set_mod_nugget", { _mod_id: mod_id, _nugget: nugget });
  }
}

export function createServerApi(
  cxt: { headers: () => any; cookies: () => any } | { cookies: () => any },
  nextOptions?: { revalidate?: number | false; tags?: string[] },
) {
  const customFetch = (req: any, options: any) => {
    if (options) {
      nextOptions ? (options.next = nextOptions) : (options.cache ??= "no-cache");
    }
    return fetch(req, options);
  };
  let supabase: SupabaseClient;
  if ("headers" in cxt) {
    supabase = createServerComponentClient(cxt, { options: { global: { fetch: customFetch } } });
  } else {
    supabase = createRouteHandlerClient(cxt, { options: { global: { fetch: customFetch } } });
  }
  return new RogueLibsApi(supabase, null);
}

export function createServiceApi(service: "SERVICE_ROLE_API") {
  if (service !== "SERVICE_ROLE_API") return null!;
  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
    auth: { flowType: "pkce" },
  });
  return new RogueLibsApi(supabase, null);
}
