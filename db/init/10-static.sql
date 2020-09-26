create table app.currency (
  id          serial primary key,
  code        text not null unique,
  symbol      char(1) not null unique,
  name        text not null unique
);
grant select on table app.currency to app_user;

create table app.account_type (
  id          serial primary key,
  name        text not null unique
);
grant select on table app.account_type to app_user;
