
create or replace function public.get_user_subscriptions(_user_id uuid)
returns int8[] as
$$
begin
  return array(
    select mod_id
    from public.mod_subscriptions
    where user_id = _user_id
  );
end;
$$ language plpgsql stable;

-- function to be used with PostgREST
create or replace function public.get_user_subscriptions(_user public.users)
returns int8[] as
$$
begin
  return public.get_user_subscriptions(_user.id);
end;
$$ language plpgsql stable;
