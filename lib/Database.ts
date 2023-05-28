interface Database {
  users: DbUser[];

  mods: DbMod[];
  mod_authors: DbModAuthor[];

  releases: DbRelease[];
  release_authors: DbReleaseAuthor[];
  release_files: DbReleaseFile[];

  uploads: DbUpload[];
  upload_refs: DbUploadRef[];
}
export default Database;

export interface DatabaseFunctions {
  set_mod_nugget: (e: { _mod_id: number; _nugget: boolean }) => number;
}

export interface DbUser {
  id: string; // uuid pk = uuid_generate_v4()
  uid: string | null; // uuid null fk(auth.users / set null) = null
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  username: string; // text { length [1;64] }
  avatar_url: string | null; // text null = null { length [1;255] }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^[\da-fA-F]{8}-([\da-fA-F]{4}-){3}[\da-fA-F]{12}$/ }
  discord_id: string | null; // text null = null { match /^\d{1,20}$/ }
  is_admin: boolean; // bool = false
}

export interface DbMod {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  guid: string | null; // text null = null { length [1;255] }
  title: string; // text { length [1;64] }
  description: string; // text = '' { length <= 4000 }
  banner_url: string | null; // text null = null { length [1;255] }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  is_public: boolean; // bool = false
  is_verified: boolean; // bool = false
  nugget_count: number; // int4 = 0
}
export interface DbModAuthor {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  user_id: string; // uuid fk(users / set default) = '00000000-0000-0000-0000-000000000000'
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  credit: string | null; // text null = null { length [1;64] }
  order: number; // int2 = 0 { >= 0 }
  is_creator: boolean; // bool = false
  can_edit: boolean; // bool = false
  can_see: boolean; // bool = true
}

export interface DbRelease {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  version: string | null; // text null = null { length <= 32, satisfy is_compatible_semver function }
  title: string; // text { length [1;64] }
  description: string; // text = '' { length <= 4000 }
  slug: string | null; // citext null = null { unique(mod_id), length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  is_public: boolean; // bool = false
}
export interface DbReleaseAuthor {
  id: number; // int8 pk identity
  release_id: number; // int8 fk(releases / cascade)
  user_id: string; // uuid fk(users / set default) = '00000000-0000-0000-0000-000000000000'
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  credit: string | null; // text null = null { length [1;64] }
  order: number; // int2 = 0 { >= 0 }
  is_creator: boolean; // bool = false
  can_edit: boolean; // bool = false
  can_see: boolean; // bool = true
}
export interface DbReleaseFile {
  id: number; // int8 pk identity
  release_id: number; // int8 fk(releases / cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  upload_id: number | null; // int8 null fk(uploads / set null) = null
  title: string | null; // text null = null { length [1;64] }
  tooltip: string | null; // text null = null { length [1;64] }
  order: number; // int2 = 0 { >= 0 }
}

export interface DbUpload {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  type: DbUploadType; // int2 { [1;3] }
  filename: string | null; // text null { length [1;64] }
  data: string | null; // text null
  hash: string; // text null { length = 32 }
  size: number; // int4 { > 0 }
  // DbUploadType.Hosted   : bucket path
  // DbUploadType.Embedded : base64 data
  // DbUploadType.External : external URL
}
export enum DbUploadType {
  Hosted = 1,
  Embedded = 2,
  External = 3,
}

export interface DbUploadRef {
  upload_id: number; // int8 pk fk(uploads / cascade)
  resource_type: DbResourceRefType; // int2 pk
  resource_id: number; // int8 pk
  created_at: string; // timestamptz = now()
}
export enum DbResourceRefType {
  ReleaseFile = 1,
}
