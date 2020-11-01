-- create custom transaction type for input in import_transactions function
create type app.transaction_type as (
  amount          money,
  is_credit       boolean,
  date            date,

  fx_amount       money,
  fx_currency_id  integer,

  narration_text  text,
  reference_text  text,
  notes           text,

  transaction_category_id     integer
);

create function app.import_transactions(account_id int, transactions app.transaction_type[]) returns app.transaction_import as $$
declare
  tx app.transaction_type;
  tx_import app.transaction_import;
begin
  insert into app.transaction_import (account_id, user_id) values
    (account_id, app.current_user_id())
    returning * into tx_import;
  foreach tx in array transactions loop
    insert into app.transaction
      (account_id, transaction_import_id, amount, is_credit, date, fx_amount, fx_currency_id, narration_text, reference_text, notes, transaction_category_id)
      values (account_id, tx_import.id, tx.amount, tx.is_credit, tx.date, tx.fx_amount, tx.fx_currency_id, tx.narration_text, tx.reference_text, tx.notes, tx.transaction_category_id);
  end loop;
  return tx_import;
end;
$$ language plpgsql volatile;

grant execute on function app.import_transactions(int, app.transaction_type[]) to app_user;

-- create or replace function app.search_transactions(account_id int, search_query text) returns setof app.transaction as $$
--   select * from app.transaction where account_id = $1 and transaction_searchable @@ to_tsquery($2);
-- $$ language sql stable;

-- create or replace function app.search_transactions(search_query text) returns setof app.transaction as $$
--   select * from app.transaction where transaction_searchable @@ to_tsquery($1);
-- $$ language sql stable;

create or replace function app.transactions_search (account_id int, search_query text)
returns setof app.transaction as $$
begin
  if $1 is not null and $2 is not null then
    return query
      select * from app.transaction
        where app.transaction.account_id = $1 and transaction_searchable @@ to_tsquery($2)
        order by date desc;
  elsif $1 is null then
    return query
      select * from app.transaction
        where transaction_searchable @@ to_tsquery($2)
        order by date desc;
  else
    return query
      select * from app.transaction
        where app.transaction.account_id = $1
        order by date desc;
  end if;
end;
$$ language plpgsql immutable;

grant execute on function app.transactions_search(int, text) to app_user;


create type app.transaction_category_type as (
  id        integer,
  name      text,
  parents   integer[],
  level     integer
);

create or replace function app.all_categories()
returns setof app.transaction_category_type as $$
  with recursive transaction_category_hierarchy as (
    select id, name, '{}'::int[] as parents, 0 as level
      from app.transaction_category
      where parent_id is null

    union all

    select tc.id, tc.name, parents || tc.parent_id, level+1
      from transaction_category_hierarchy tch
      join app.transaction_category tc
      on tc.parent_id = tch.id
      where not tc.id = any(parents)
  )
  select id, name, parents, level from transaction_category_hierarchy;
$$ language sql immutable;

grant execute on function app.all_categories() to app_user;

-- with recursive transaction_category_hierarchy as (
--   select id, name, '{}'::int[] as parents, 0 as level
--     from app.transaction_category
--     where parent_id is null

--   union all

--   select tc.id, tc.name, parents || tc.parent_id, level+1
--     from transaction_category_hierarchy tch
--     join app.transaction_category tc
--     on tc.parent_id = tch.id
--     where not tc.id = any(parents)
-- )
-- select name, id, parents, level from transaction_category_hierarchy;
