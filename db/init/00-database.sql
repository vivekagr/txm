\connect txm;

create schema app;
create schema app_private;

create table app.currency (
    code        text primary key,
    name        text not null
);

create type app.account_type as enum (
    'savings_account',
    'current_account',
    'credit_card',
    'forex_card'
);

create table app.account (
    id              serial primary key,
    slug            text not null unique check(char_length(slug) < 10),
    bank            text not null,
    number          text,
    type            app.account_type,
    currency        text not null references app.currency(code)
);

create table app.transaction_category (
    id              serial primary key,
    slug            text not null unique check(char_length(slug) < 20),
    name            text not null
);

create table app.transaction_import (
    id              serial primary key,
    account         integer not null references app.account(id),
    ts              timestamp not null default current_timestamp
);

create table app.transaction (
    id              serial primary key,
    account         integer not null references app.account(id),

    amount          money not null,
    is_credit       boolean not null,
    date            date not null,

    fx_amount       money,
    fx_currency     text references app.currency(code),

    narration_text  text not null,
    reference_text  text,
    notes           text,

    category        integer references app.transaction_category(id)
);
