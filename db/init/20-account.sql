create table app.account (
  id              serial primary key,
  bank            text not null,
  number          text,
  account_type_id integer not null references app.account_type,
  currency_id     integer not null references app.currency,
  created_ts      timestamp not null default current_timestamp
);
create index on app.account (account_type_id);
create index on app.account (currency_id);
