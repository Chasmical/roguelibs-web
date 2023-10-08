
create or replace function public.get_user_badges(_user_id uuid)
returns text[] as
$$
begin
  return array(
    select badge_name
    from public.user_badges
    where user_id = _user_id
  );
end;
$$ language plpgsql stable;

-- function to be used with PostgREST
create or replace function public.get_user_badges(_user public.users)
returns text[] as
$$
begin
  return public.get_user_badges(_user.id);
end;
$$ language plpgsql stable;
