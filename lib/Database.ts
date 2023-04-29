interface Database {
  // core things
  users: DbUser[];

  // tables for mods and stuff
  mods: DbMod[];
  mod_authors: DbModAuthor[];
  releases: DbRelease[];
  release_authors: DbReleaseAuthor[];
  release_files: DbReleaseFile[];

  // tables for SoR: House of Cards
  hoc_cards: DbCard[];
}
export default Database;

export interface DbUser {
  id: string; // uuid pk = uuid_generate_v4()
  uid: string | null; // uuid null fk(auth.users set null) = null
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  username: string; // text { length [1;64] }
  avatar_url: string | null; // text null = null { length [1;255] }
  discord_id: string | null; // text null = null { match /^\d{1,20}$/ }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^[\da-fA-F]{8}-([\da-fA-F]{4}-){3}[\da-fA-F]{12}$/ }
  is_admin: boolean; // bool = false
}

export interface DbMod {
  id: number; // int8 pk identity
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  guid: string | null; // text null = null { length [1;255] }
  slug: string | null; // citext null = null { unique, length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  is_public: boolean; // bool = false
  nugget_count: number; // int4 = 0
}
export interface DbModAuthor {
  mod_id: number; // int8 pk fk(mods cascade)
  user_id: string; // uuid pk fk(users set default) = '00000000-0000-0000-0000-000000000000'
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
  mod_id: number; // int8 fk(mods cascade)
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  version: string | null; // text null = null { length <= 32, satisfy is_compatible_semver function }
  slug: string | null; // citext null = null { unique(mod_id), length [3;32], match /^[0-9a-zA-Z._-]+$/, not match /^\d+$/ }
  is_public: boolean; // bool = false
}
export interface DbReleaseAuthor {
  release_id: number; // int8 pk fk(releases cascade)
  user_id: string; // uuid pk fk(users set default) = '00000000-0000-0000-0000-000000000000'
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  credit: string | null; // text null = null { length [1;64] }
  order: number; // int2 = 0 { >= 0 }
  is_creator: boolean; // bool = false
  can_edit: boolean; // bool = false
  can_see: boolean; // bool = true
}
export interface DbReleaseFile {
  release_id: number; // int8 pk fk(releases cascade)
  filename: string; // text pk { length [1;64] }
  created_at: string; // timestamptz = now()
  edited_at: string | null; // timestamptz null = null
  title: string | null; // text null = null { length [1;64] }
  tooltip: string | null; // text null = null { length [1;64] }
  order: number; // int2 = 0 { >= 0 }
  type: DbReleaseFileType; // int2 = 0
}
export enum DbReleaseFileType {
  Unknown = 0,
}

export interface DbCard {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: "character" | "structure" | "item" | "ability" | "usable" | "trait";
  cost: number | null;
  health: number | null;
  attack: number | null;
}
