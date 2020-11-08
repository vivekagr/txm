import { replace } from 'svelte-spa-router'
import wrap from 'svelte-spa-router/wrap'

import { authToken } from 'app/stores'
import Accounts from './Accounts/AccountList.svelte'
import AccountDetail from './Accounts/AccountDetail.svelte'
import TransactionImports from './Transactions/TransactionImports.svelte'
import TransactionImportDetail from './Transactions/TransactionImportDetail.svelte'
import AuthLogin from './Auth/Login.svelte'
import AuthLogout from './Auth/Logout.svelte'

// Wrapper around given component that checks for valid auth token
const requireAuth = (component) =>
  wrap({
    component,
    conditions: [() => authToken.isValid()],
  })

export function conditionsFailed(event) {
  replace(`/login?next=${event.detail.route}`)
}

export const routes = {
  '/': requireAuth(Accounts),
  '/login': AuthLogin,
  '/logout': AuthLogout,
  '/accounts': requireAuth(Accounts),
  '/accounts/:id': requireAuth(AccountDetail),
  '/transactions/imports': requireAuth(TransactionImports),
  '/transactions/imports/new': wrap({
    asyncComponent: () => import('./Transactions/TransactionImportNew.svelte'),
    conditions: [() => authToken.isValid()],
  }),
  '/transactions/imports/:id': requireAuth(TransactionImportDetail),
}
