create or replace function public.upsert_mdx_preview(_source text, _is_verified bool)
returns uuid security definer as
$$
declare
  _uid uuid;
begin

  if not exists(select 1 from public.users where uid = auth.uid()) then
    raise exception 'User is not authenticated.';
  end if;

  select uid from public.mdx_previews
  where created_by = auth.uid()
  into _uid;

  if _uid is null then
    insert into public.mdx_previews(source, is_verified)
    values(_source, _is_verified)
    returning uid into _uid;
  else
    update public.mdx_previews
    set source = _source
      , is_verified = _is_verified
    where uid = _uid;
  end if;

  return _uid;

end;
$$ language plpgsql volatile;
