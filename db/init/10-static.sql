create table app.currency (
  id          serial primary key,
  code        text not null unique,
  name        text not null unique
);

create table app.account_type (
  id          serial primary key,
  name        text not null unique
);
