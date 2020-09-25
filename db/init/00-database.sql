\connect txm;

create schema app;
create schema app_private;

create table app.currency (
  id          serial primary key,
  code        text not null unique,
  name        text not null unique
);

create table app.account_type (
  id          serial primary key,
  name        text not null unique
);

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

create table app.transaction_category (
  id              serial primary key,
  slug            text not null unique check(char_length(slug) < 20),
  name            text not null
);

create table app.transaction_import (
  id              serial primary key,
  account_id      integer not null references app.account,
  ts              timestamp not null default current_timestamp
);
create index on app.transaction_import(account_id);

create table app.transaction (
  id              serial primary key,
  account_id      integer not null references app.account,
  transaction_import_id  integer not null references app.transaction_import,

  amount          money not null,
  is_credit       boolean not null,
  date            date not null,

  fx_amount       money,
  fx_currency_id  integer references app.currency,

  narration_text  text not null,
  reference_text  text,
  notes           text,

  transaction_category_id     integer references app.transaction_category
);
create index on app.transaction(account_id);
create index on app.transaction(transaction_import_id);
create index on app.transaction(date);
create index on app.transaction(fx_currency_id);
create index on app.transaction(transaction_category_id);
