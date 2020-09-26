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
  insert into app.transaction_import (account_id) values (account_id) returning * into tx_import;
  foreach tx in array transactions loop
    insert into app.transaction
      (account_id, transaction_import_id, amount, is_credit, date, fx_amount, fx_currency_id, narration_text, reference_text, notes, transaction_category_id)
      values (account_id, tx_import.id, tx.amount, tx.is_credit, tx.date, tx.fx_amount, tx.fx_currency_id, tx.narration_text, tx.reference_text, tx.notes, tx.transaction_category_id);
  end loop;
  return tx_import;
end;
$$ language plpgsql volatile;

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
