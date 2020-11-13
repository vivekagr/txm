import type { SvelteComponent } from 'svelte'
import { replace, RouterEvent, RouteDetail, RouteDefinition } from 'svelte-spa-router'
import wrap from 'svelte-spa-router/wrap'

import { authToken } from 'app/stores'
import Accounts from './Accounts/AccountList.svelte'
import AccountDetail from './Accounts/AccountDetail.svelte'
import TransactionImports from './Transactions/TransactionImports.svelte'
import TransactionImportDetail from './Transactions/TransactionImportDetail.svelte'
import AuthLogin from './Auth/Login.svelte'
import AuthLogout from './Auth/Logout.svelte'
import AuthSignup from './Auth/Signup.svelte'

// Wrapper around given component that checks for valid auth token
const requireAuth = (component: typeof SvelteComponent) =>
  wrap({
    component,
    conditions: [() => authToken.isValid()],
  })

export function conditionsFailed(event: RouterEvent<RouteDetail>): void {
  replace(`/login?next=${event.detail.route}`)
}

export const routes: RouteDefinition = {
  '/': requireAuth(Accounts),
  '/login': AuthLogin,
  '/logout': AuthLogout,
  '/signup': AuthSignup,
  '/accounts': requireAuth(Accounts),
  '/accounts/:id': requireAuth(AccountDetail),
  '/transactions/imports': requireAuth(TransactionImports),
  '/transactions/imports/new': wrap({
    asyncComponent: () => import('./Transactions/TransactionImportNew.svelte'),
    conditions: [() => authToken.isValid()],
  }),
  '/transactions/imports/:id': requireAuth(TransactionImportDetail),
}
