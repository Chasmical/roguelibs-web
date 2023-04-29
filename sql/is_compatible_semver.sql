create or replace function public.is_compatible_semver(semver text)
returns boolean as
$$
declare
  _match text[];
  _part text;
begin

  if semver is null then
    return null;
  end if;

  select regexp_match(semver, '^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$') into _match;

  if _match is null then
    return false;
  end if;

  if length(_match[1]) > 10 or length(_match[2]) > 10 or length(_match[3]) > 10 then
    -- the version components are too long
    return false;
  end if;

  if _match[1]::bigint > 2147483647 or _match[2]::bigint > 2147483647 or _match[3]::bigint > 2147483647 then
    -- the version components are too big
    return false;
  end if;

  if _match[4] is not null then
    for _part in
      select unnest(string_to_array(_match[4], '.'))
    loop
      if _part ~ '^\d+$' and (length(_part) > 10 or _part::bigint > 2147483647) then
        -- the numeric pre-release is too long or too big
        return false;
      end if;
    end loop;
  end if;

  return true;

end;
$$ language plpgsql immutable;
