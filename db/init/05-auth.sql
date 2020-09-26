-- by default functions are executable by public -- remove this
alter default privileges revoke execute on functions from public;

-- for postgraphile to connect to the db
create role app_postgraphile login password 'supersecret';

-- for anonymous users, also used as the default role for ostgraphile
create role app_anonymous;
grant app_anonymous to app_postgraphile;

-- for authenticated users
create role app_user;
grant app_user to app_postgraphile;

-- doesn't allow full access, just allows these roles to know about
-- the existence of app schema and that they 'may' access objects in it
grant usage on schema app to app_anonymous, app_user;
