import Accounts from './Accounts.svelte';
import TransactionImportNew from './Transactions/TransactionImportNew.svelte';

const routes = {
  '/': Accounts,
  '/accounts/:accountId?': Accounts,
  '/transactions/imports/new': TransactionImportNew
}

export default routes;
