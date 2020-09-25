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
