create or replace function public.set_mod_nugget(_mod_id int8, _nugget bool)
returns int4 security definer as
$$
declare
  _prev_nugget bool;
begin

  if not exists(select 1 from public.users where uid = auth.uid()) then
    raise exception 'User is not authenticated.';
  end if;

  if not is_mod_visible(_mod_id, auth.uid()) then
    raise exception 'A mod with the specified id does not exist or is hidden.';
  end if;

  select exists(
    select 1 from public.mod_nuggets
    where mod_id = _mod_id and user_id = auth.uid()
  ) into _prev_nugget;

  if _nugget != _prev_nugget then
    if _nugget then
      insert into public.mod_nuggets(mod_id, user_id)
      values(_mod_id, auth.uid());
    else
      delete from public.mod_nuggets
      where mod_id = _mod_id and user_id = auth.uid();
    end if;

    update public.mods
    set nugget_count = nugget_count + case _nugget when true then 1 else -1 end
    where id = _mod_id;
  end if;

  return (select nugget_count from public.mods
  where id = _mod_id);

end;
$$ language plpgsql volatile;
