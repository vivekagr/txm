import Accounts from './Accounts.svelte';
import TransactionImports from './Transactions/TransactionImports.svelte';
import TransactionImportDetail from './Transactions/TransactionImportDetail.svelte';
import TransactionImportNew from './Transactions/TransactionImportNew.svelte';

const routes = {
  '/': Accounts,
  '/accounts/:accountId?': Accounts,
  // '/transactions/:accountId?': ImportTransactions
  '/transactions/imports/': TransactionImports,
  '/transactions/imports/new': TransactionImportNew,
  '/transactions/imports/:id': TransactionImportDetail,
}

export default routes;
