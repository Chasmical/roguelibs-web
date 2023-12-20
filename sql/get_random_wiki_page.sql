create or replace function public.get_random_wiki_page_id()
returns int8 as
$$
declare
  _min_id int8;
  _max_id int8;
  _id int8;
begin
  select min(id), max(id) into _min_id, _max_id from wiki_pages;

  loop
    _id := _min_id + trunc(random() * (_max_id - _min_id + 1));
    if exists(select 1 from wiki_pages where id = _id) then
      return _id;
    end if;
  end loop;
end;
$$ language plpgsql volatile;

create or replace function public.get_random_wiki_page_slug()
returns text as
$$
declare
  _page_id int8;
begin
  _page_id = public.get_random_wiki_page_id();

  return (
    select slug
    from wiki_page_slugs
    where page_id = _page_id and is_primary
  );
end;
$$ language plpgsql volatile;

create or replace function public.get_random_wiki_page_slug(_except text)
returns text as
$$
declare
  _slug text;
begin
  loop
    _slug := public.get_random_wiki_page_slug();
    if _slug != _except then
      return _slug;
    end if;
  end loop;
end;
$$ language plpgsql volatile;
