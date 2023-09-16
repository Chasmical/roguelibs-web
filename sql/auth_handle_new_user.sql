create or replace function auth_users_handle_new_user()
returns trigger security definer as
$$
declare
  _username text;
  _avatar_url text;
  _slug text;
begin

  _username := left(new.raw_user_meta_data#>>'{custom_claims,global_name}', 64);
  if _username is null or length(_username) = 0 then
    _username := left(new.raw_user_meta_data->>'full_name', 64);
  end if;
  if _username is null or length(_username) = 0 then
    _username := new.id;
  end if;

  _avatar_url := new.raw_user_meta_data->>'avatar_url';
  if length(_avatar_url) not between 1 and 255 then
    _avatar_url := null;
  end if;

  -- construct a url slug from any valid characters
  select array_to_string(array(
    select * from regexp_matches(_username, '[0-9a-zA-Z._-]+', 'g')
  ), '') into _slug;
  if length(_slug) > 32 then
    _slug := left(_slug, 32);
  end if;
  if length(_slug) < 3 or exists(select 1 from public.users where slug = _slug) then
    _slug := null;
  end if;

  insert into public.users (id, uid, username, avatar_url, slug)
  values (new.id, new.id, _username, _avatar_url, _slug);

  return new;

end;
$$ language plpgsql;

drop trigger if exists auth_users_handle_new_user on auth.users;

create trigger auth_users_handle_new_user
after insert on auth.users
for each row execute function auth_users_handle_new_user();
