import Accounts from './Accounts.svelte';
import Transactions from './Transactions.svelte';

const routes = {
    '/': Accounts,
    '/accounts/:account?': Accounts,
    '/transactions/:account?': Transactions
}

export default routes;
