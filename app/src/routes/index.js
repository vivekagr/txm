import wrap from 'svelte-spa-router/wrap'

import Accounts from './Accounts.svelte';
import AccountDetail from './Accounts/AccountDetail.svelte';
import TransactionImports from './Transactions/TransactionImports.svelte';
import TransactionImportDetail from './Transactions/TransactionImportDetail.svelte';
// import TransactionImportNew from './Transactions/TransactionImportNew.svelte';
import AuthLogin from './Auth/Login.svelte';
import AuthLogout from './Auth/Logout.svelte';
import authToken from '../stores/auth'

// Wrapper around given component that checks for valid auth token
const requireAuth = component => wrap({
  component,
  conditions: [() => authToken.isValid()]
})

const routes = {
  '/': requireAuth(Accounts),
  '/login': AuthLogin,
  '/logout': AuthLogout,
  '/accounts': requireAuth(Accounts),
  '/accounts/:id': requireAuth(AccountDetail),
  '/transactions/imports': requireAuth(TransactionImports),
  // '/transactions/imports/new': TransactionImportNew,
  '/transactions/imports/:id': requireAuth(TransactionImportDetail),
}

export default routes;
