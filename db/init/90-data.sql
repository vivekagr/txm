\connect txm;

insert into app.account_type (name) values
  ('Savings Account'),
  ('Current Account'),
  ('Credit Card');

insert into app.currency (code, name, symbol) values
  ('inr', 'Indian Rupees', '₹'),
  ('usd', 'US Dollars', '$'),
  ('eur', 'Euros', '€');

select * from app.register_user('user1', 'user1', 'pass');
select * from app.register_user('user2', 'user2', 'pass');
select * from app.register_user('user3', 'user3', 'pass');

insert into app.account (user_id, bank, number, account_type_id, currency_id) values
  (1, 'HDFC', '3403', 1, 1);

-- select * from app.import_transactions(1, array[row(123, true, '2020-09-24'::timestamp, null, null, 'narration', null, null, null)]::app.transaction_type[]);
