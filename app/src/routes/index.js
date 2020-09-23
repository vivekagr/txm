import Accounts from './Accounts.svelte';
import Transactions from './Transactions.svelte';

const routes = {
    '/': Accounts,
    '/transactions/:account?': Transactions
}

export default routes;
