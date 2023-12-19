create or replace view verified_wiki_page_revisions
as
  select distinct on (page_id) wiki_page_revisions.*
  from wiki_page_revisions
  where is_verified
  order by page_id, created_at desc
;
