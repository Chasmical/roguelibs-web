export interface DatabaseTables {
  users: DbUser[];
  user_notifications: DbUserNotification[];

  mods: DbMod[];
  mod_authors: DbModAuthor[];
  mod_nuggets: DbModNugget[];

  releases: DbRelease[];
  release_files: DbReleaseFile[];

  uploads: DbUpload[];
  upload_refs: DbUploadRef[];
}

export interface DatabaseViews {
  latest_releases: DbRelease[];
}

export interface DatabaseFunctions {
  set_mod_nugget: (e: { _mod_id: number; _nugget: boolean }) => number;
  get_user_nuggets: (e: DbUser) => number[];
}

interface Database {
  tables: DatabaseTables;
  views: DatabaseViews;
  functions: DatabaseFunctions;
}
export default Database;

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
export interface DbUserNotification {
  id: number; // int8 pk identity
  user_id: string; // uuid fk(users / cascade)
  created_at: string; // timestamptz = now()
  is_read: boolean; // bool = false
  message: string; // text { length [1;255] }
  type: DbUserNotificationType; // int2 = 0 { >= 0 }
}
export enum DbUserNotificationType {
  Unknown = 0,
  Welcome = 1,
}

export interface DbMod {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  title: string; // text { length [1;64] }
  description: string; // text { length [1;4000] }
  banner_url: string | null; // text null = null { length [1;255] }
  banner_layout: number; // int2 = 5 { [1;7] }
  is_public: boolean; // bool = false
  is_verified: boolean; // bool = false
  nugget_count: number; // int4 = 0
  guid: string | null; // text null = null { length [1;255] }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
}
export interface DbModAuthor {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  user_id: string; // uuid fk(users / set default) = '00000000-0000-0000-0000-000000000000'
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  credit: string | null; // text null = null { length [1;64] }
  is_creator: boolean; // bool = false
  can_edit: boolean; // bool = false
  can_see: boolean; // bool = true
  order: number; // int2 = 0 { >= 0 }
}
export interface DbModNugget {
  mod_id: number; // int8 pk fk(mods / cascade)
  user_id: string; // uuid pk fk(users / cascade)
}

export interface DbRelease {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  version: string | null; // text null = null { length <= 32, satisfy is_compatible_semver function }
  slug: string | null; // citext null = null { unique(mod_id), length [1;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  is_public: boolean; // bool = false
}
export interface DbReleaseFile {
  id: number; // int8 pk identity
  release_id: number; // int8 fk(releases / cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  upload_id: number; // int8 null fk(uploads / set null) = null
  title: string | null; // text null = null { length [1;64] }
  tooltip: string | null; // text null = null { length [1;128] }
  order: number; // int2 = 0
}

export interface DbUpload {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  type: DbUploadType; // int2 { [1;3] }
  filename: string | null; // text null { length [1;64] }
  data: string | null; // text null
  hash: string | null; // text null { length = 32, match /^[0-9a-f]+$/ }
  size: number; // int4 { > 0 }
}
export enum DbUploadType {
  Hosted = 1, // bucket path
  Embedded = 2, // base64 data
  External = 3, // external URL
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
