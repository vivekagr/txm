create table app.account (
  id              serial primary key,
  user_id         integer not null references app.user,
  bank            text not null,
  number          text,
  account_type_id integer not null references app.account_type,
  currency_id     integer not null references app.currency,
  created_ts      timestamp not null default current_timestamp
);

create index on app.account (account_type_id);
create index on app.account (currency_id);

-- only allow app_user role to run queries on this table
grant insert, select, update, delete on table app.account to app_user;

alter table app.account enable row level security;

create policy insert_account on app.account for insert to app_user
  with check (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);
create policy select_account on app.account for select to app_user
  using (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);
create policy update_account on app.account for update to app_user
  using (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);
create policy delete_account on app.account for delete to app_user
  using (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);
