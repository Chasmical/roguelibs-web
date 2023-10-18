create or replace function mod_subscriptions_ensure_valid_release()
returns trigger as
$$
begin
  if new.release_id is not null then
    if new.mod_id not in (select mod_id from releases where id = new.release_id) then
      raise exception 'The specified release does not belong to the subscribed mod.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;



drop trigger if exists mod_subscriptions_ensure_valid_release on public.mod_subscriptions;

create trigger mod_subscriptions_ensure_valid_release
after insert or delete or update of mod_id, release_id on public.mod_subscriptions
for each row execute function mod_subscriptions_ensure_valid_release();
