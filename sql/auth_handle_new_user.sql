create or replace function auth_users_handle_new_user()
returns trigger security definer as
$$
declare
  _username text;
  _avatar_url text;
begin

  _username := left(new.raw_user_meta_data->>'full_name', 64);
  if _username is null or length(_username) = 0 then
    _username := new.id;
  end if;

  _avatar_url := new.raw_user_meta_data->>'avatar_url';
  if length(_avatar_url) not between 1 and 255 then
    _avatar_url := null;
  end if;

  insert into public.users (id, uid, username, avatar_url)
  values (new.id, new.id, _username, _avatar_url);

  return new;

end;
$$ language plpgsql;

drop trigger if exists auth_users_handle_new_user on auth.users;

create trigger auth_users_handle_new_user
after insert on auth.users
for each row execute function auth_users_handle_new_user();
