-- jwt type
create type app.jwt_token as (
  role text,
  user_id integer,
  exp bigint
);

create table app.user (
  id          serial primary key,
  username    text not null unique check(char_length(username) < 20),
  name        text not null check(char_length(name) < 100),
  created_ts  timestamp not null default current_timestamp
);
-- only allow app_user role to query, update and delete records
grant select, update, delete on table app.user to app_user;
-- enable row level security for user table
alter table app.user enable row level security;
-- add policy to check id
-- note: we won't allow inserts since that's being handled by app.register_user function below
create policy policy_user on app.user for all
  to app_user
  using (id = app.current_user_id());

-- don't expose user table over graphql
comment on table app.user is
  E'@omit';

create table app_private.user (
  user_id       integer primary key references app.user(id) on delete cascade,
  password_hash text not null
);
comment on table app_private.user is 'Used to keep password hash in a separate schema & table';

create or replace function app.register_user(username text, name text, password text)
  returns app.user as $$
declare
  u app.user;
begin
  -- insert row in app.user table
  insert into app.user (username, name)
    values (username, name)
    returning * into u;
  -- now insert row in app_private.user table with reference to
  -- the above row & hashed password
  insert into app_private.user (user_id, password_hash)
    values (u.id, crypt(password, gen_salt('bf')));
  return u;
end;
$$ language plpgsql strict security definer;
comment on function app.register_user(text, text, text) is 'User registration function, returns user object.';
grant execute on function app.register_user(text, text, text) to app_anonymous;

create or replace function app.authenticate(username text, password text)
  returns app.jwt_token as $$
declare _user_id integer;
declare _user_priv app_private.user;
begin
  -- extract the user's id
  select id into _user_id
    from app.user
    where app.user.username = $1;

  -- select the row from app_private.user table containing password hash
  select u.* into _user_priv
    from app_private.user as u
    where u.user_id = _user_id;

  -- hash given password and compare against stored password hash
  if _user_priv.password_hash = crypt(password, _user_priv.password_hash) then
    return ('app_user', _user_id, extract(epoch from (now() + interval '1 day')))::app.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;
comment on function app.authenticate(text, text) is 'User authentication function that returns JWT token, given valid credentials.';
grant execute on function app.authenticate(text, text) to app_anonymous, app_user;

create or replace function app.current_user() returns app.user as $$
  select *
    from app.user
    where id = app.current_user_id()
$$ language sql stable;
comment on function app.current_user is 'Get current user object, if logged in.';
grant execute on function app.current_user() to app_anonymous, app_user;
