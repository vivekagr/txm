import Accounts from './Accounts.svelte';
import TransactionImports from './Transactions/TransactionImports.svelte';
import TransactionImportNew from './Transactions/TransactionImportNew.svelte';

const routes = {
  '/': Accounts,
  '/accounts/:accountId?': Accounts,
  '/transactions/imports/': TransactionImports,
  '/transactions/imports/new': TransactionImportNew
}

export default routes;
