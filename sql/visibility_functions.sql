create or replace function is_mod_visible(_mod_id int8, _user_id uuid)
returns boolean security definer as
$$
declare
  _mod public.mods;
  _author public.mod_authors;
begin

  select * from public.mods
  where id = _mod_id
  into _mod;

  if not found then return false; end if;

  if _mod.is_public then return true; end if;

  select * from public.mod_authors
  where mod_id = _mod_id and user_id = _user_id
  into _author;

  return found and _author.can_see;

end;
$$ language plpgsql stable;

create or replace function is_release_visible(_release_id int8, _user_id uuid)
returns boolean security definer as
$$
declare
  _mod public.mods;
  _release public.releases;
  _author public.mod_authors;
begin

  select * from public.releases
  where id = _release_id
  into _release;

  if not found then return false; end if;

  if not is_mod_visible(_release.mod_id, _user_id) then return false; end if;

  if _release.is_public then return true; end if;

  select * from public.mod_authors
  where mod_id = _release.mod_id and user_id = _user_id
  into _author;

  return found and _author.can_see;

end;
$$ language plpgsql stable;
