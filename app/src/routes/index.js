import Accounts from './Accounts.svelte';
import Transactions from './Transactions.svelte';

const routes = {
    '/': Accounts,
    '/accounts/:accountId?': Accounts,
    '/transactions/:accountId?': Transactions
}

export default routes;
