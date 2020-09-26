\connect txm;

insert into app.account_type (name) values
  ('Savings Account'),
  ('Current Account'),
  ('Credit Card');

insert into app.currency (code, name) values
  ('inr', 'Indian Rupees'),
  ('usd', 'US Dollars'),
  ('eur', 'Euros');

insert into app.account (bank, number, account_type_id, currency_id) values
  ('HDFC', '3403', 1, 1);

select * from app.import_transactions(1, array[row(123, true, '2020-09-24'::timestamp, null, null, 'narration', null, null, null)]::app.transaction_type[]);
