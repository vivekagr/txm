create table app.transaction_category (
  id              serial primary key,
  user_id         integer not null references app.user,
  name            text not null,
  rules           text[],
  parent_id       integer references app.transaction_category
);

create index on app.transaction_category (user_id);
create index on app.transaction_category (parent_id);

grant insert, select, update, delete on table app.transaction_category to app_user;

alter table app.transaction_category enable row level security;

create policy transaction_category on app.transaction_category for all to app_user
  using (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);

-------

create table app.transaction_import (
  id              serial primary key,
  user_id         integer not null references app.user,
  account_id      integer not null references app.account,
  ts              timestamp not null default current_timestamp
);

create index on app.transaction_import(user_id);
create index on app.transaction_import(account_id);

grant insert, select, delete on table app.transaction_import to app_user;
grant usage on app.transaction_import_id_seq to app_user;

alter table app.transaction_import enable row level security;

create policy transaction_import on app.transaction_import for all to app_user
  using (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);

--------

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
create index on app.transaction(date desc);
create index on app.transaction(fx_currency_id);
create index on app.transaction(transaction_category_id);

alter table app.transaction add column transaction_searchable tsvector
  generated always as (to_tsvector('english', (coalesce(narration_text, '') || ' ' || coalesce(reference_text, '') || ' ' || coalesce(notes, '')))) stored;
create index transaction_searchable_idx on app.transaction using gin (transaction_searchable);

grant insert, select, update, delete on table app.transaction to app_user;
grant usage on app.transaction_id_seq to app_user;

alter table app.transaction enable row level security;

create policy transaction on app.transaction for all to app_user
  using (exists (
    select 1 from app.account
      where app.account.id = account_id and app.account.user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer));
