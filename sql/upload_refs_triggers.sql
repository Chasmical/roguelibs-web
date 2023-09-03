create or replace function handle_upload_refs()
returns trigger security definer as
$$
declare
  _column_name text;
  _resource_type int2;
  _old_upload_id int8;
  _new_upload_id int8;
begin

  _column_name := quote_ident(TG_ARGV[0]);
  _resource_type := TG_ARGV[1]::int2;

  execute format('select $1.%1$I, $2.%1$I', _column_name)
  into _old_upload_id, _new_upload_id
  using old, new;

  if _new_upload_id is distinct from _old_upload_id then

    if _old_upload_id is not null then
      delete from public.upload_refs
      where upload_id = _old_upload_id
        and resource_type = _resource_type
        and resource_id = old.id;
    end if;

    if _new_upload_id is not null then
      insert into public.upload_refs(upload_id, resource_type, resource_id)
        values(_new_upload_id, _resource_type, new.id);
    end if;

  end if;

  return new;
end;
$$ language plpgsql;



drop trigger if exists release_files_handle_upload_refs on public.release_files;

create trigger release_files_handle_upload_refs
after insert or delete or update of upload_id on public.release_files
for each row execute function handle_upload_refs('upload_id', 1);
