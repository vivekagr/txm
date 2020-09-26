import Accounts from './Accounts.svelte';
import AccountDetail from './Accounts/AccountDetail.svelte';
import TransactionImports from './Transactions/TransactionImports.svelte';
import TransactionImportDetail from './Transactions/TransactionImportDetail.svelte';
import TransactionImportNew from './Transactions/TransactionImportNew.svelte';

const routes = {
  '/': Accounts,
  '/accounts': Accounts,
  '/accounts/:id': AccountDetail,
  '/transactions/imports/': TransactionImports,
  '/transactions/imports/new': TransactionImportNew,
  '/transactions/imports/:id': TransactionImportDetail,
}

export default routes;
