-- custom create_account function because the create mutation generate by postgraphile requires user_id
-- however we want to automatically set that based on authenticated user's id
create function app.create_account(bank text, number text, account_type_id int, currency_id int)
returns app.account
as $$
  insert into app.account (user_id, bank, number, account_type_id, currency_id) values
    (app.current_user_id(), bank, number, account_type_id, currency_id)
    returning *;
$$ language sql strict volatile;

grant execute on function app.create_account(text, text, int, int) to app_user;
