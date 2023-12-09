import { ImageLayout } from "@components/Common/LayoutImage";
import { BadgeName } from "@lib/badges";

export interface DatabaseTables {
  users: DbUser[];
  user_notifications: DbUserNotification[];
  user_badges: DbUserBadge[];

  mods: DbMod[];
  mod_authors: DbModAuthor[];
  mod_nuggets: DbModNugget[];
  mod_subscriptions: DbModSubscription[];

  releases: DbRelease[];
  release_files: DbReleaseFile[];

  uploads: DbUpload[];
  upload_refs: DbUploadRef[];

  mdx_previews: DbMdxPreview[];
}

export interface DatabaseViews {
  latest_releases: DbRelease[];
}

export interface DatabaseFunctions {
  set_mod_nugget: (e: { _mod_id: number; _nugget: boolean }) => number;
  set_mod_subscription: (e: { _mod_id: number; _subscription: boolean }) => number;
  get_user_nuggets: (e: DbUser) => number[];
  get_user_subscriptions: (e: DbUser) => number[];
  get_user_badges: (e: DbUser) => string[];
  upsert_mdx_preview: (e: { _source: string; _is_verified: boolean }) => string;
  search_users: (e: { _term: string; _limit: number }) => UserSearchResult[];
}

export type UserSearchResult = DbUser & { similarity: number };

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
  description: string; // text = '' { length <= 400 }
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
export interface DbUserBadge {
  user_id: string; // uuid pk fk(users / cascade)
  badge_name: BadgeName; // text pk
  automatic: boolean; // bool = true
}

export interface DbMod {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  title: string; // text { length [1;64] }
  description: string; // text = '' { length <= 4000 }
  banner_url: string | null; // text null = null { length [1;255] }
  banner_layout: ImageLayout; // int2 = 5 { [1;7] }
  is_public: boolean; // bool = false
  is_verified: boolean; // bool = false
  nugget_count: number; // int4 = 0
  subscription_count: number; // int4 = 0
  guid: string | null; // text null = null { length [1;255] }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  card_description: string | null; // text null = null { length [1;255] }
  card_banner_url: string | null; // text null = null { length [1;255] }
  card_banner_layout: ImageLayout; // int2 = 5 { [1;7] }
  github_repo: string | null; // text null = null { length <= 64, match /^[\w.-]+\/[\w.-]+$/ }
  gamebanana_id: number | null; // int4 null = null { > 0 }
  website_link: string | null; // text null = null { length <= 128, match /^https:\/\// }
}
export interface DbModAuthor {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  user_id: string; // uuid fk(users / set default) = '00000000-0000-0000-0000-000000000000'
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  credit: string | null; // text null = null { length [1;128] }
  is_creator: boolean; // bool = false
  can_edit: boolean; // bool = false
  can_see: boolean; // bool = true
  order: number; // int2 = 0 { >= 0 }
}
export interface DbModNugget {
  mod_id: number; // int8 pk fk(mods / cascade)
  user_id: string; // uuid pk fk(users / cascade)
}
export interface DbModSubscription {
  mod_id: number; // int8 pk fk(mods / cascade)
  user_id: string; // uuid pk fk(users / cascade)
  release_id: number | null; // int8 null = null fk(releases / set null)
}

export interface DbRelease {
  id: number; // int8 pk identity
  mod_id: number; // int8 fk(mods / cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  version: string | null; // text null = null { length <= 32, satisfy is_compatible_semver function }
  slug: string | null; // citext null = null { unique(mod_id), length [1;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  title: string | null; // text null = null { length [1;128] }
  changelog: string; // text = '' { length <= 1000 }
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
  type: DbReleaseFileType; // int2 = 0 { [0;6] }
}
export enum DbReleaseFileType {
  Unknown = 0,
  Plugin = 1,
  PatcherPlugin = 2,
  CorePlugin = 3,
  SpritePack = 4,
  Documentation = 5,
  Extra = 6,
}

export interface DbUpload {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  type: DbUploadType; // int2 { [1;3] }
  filename: string; // text { length [1;64] }
  data: string | null; // text null
  hash: string | null; // text null { length = 32, match /^[0-9a-f]+$/ }
  size: number; // int4 { > 0 }
}
export enum DbUploadType {
  Hosted = 1, // hosted at /uploads/{id}
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

export interface DbMdxPreview {
  uid: string; // uuid pk = uuid_generate_v4()
  created_by: string; // uuid fk(users / cascade)
  created_at: string; // timestamptz = now()
  source: string; // text
  is_verified: boolean; // bool = false
}
