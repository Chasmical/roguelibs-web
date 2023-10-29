create or replace function public.search_users(_term text, _limit int)
returns setof record
as
$$
select *,
  greatest(
    similarity(users.username, _term),
    similarity(users.slug, _term)
  ) as similarity
from users
  where greatest(
    similarity(users.username, _term),
    similarity(users.slug, _term)
  ) > 0
  order by similarity desc
  limit _limit
$$ language sql;
