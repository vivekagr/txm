<script>
  import { query } from 'svelte-apollo';
  import QUERIES from '../../queries';
  import TransactionList from '../Transactions/_TransactionList.svelte';
  import AccountForm from './AccountForm.svelte';

  export let params = {};

  let searchQuery = null;

  $: transactions = query(QUERIES.TRANSACTION.SEARCH, {
    variables: {
      accountId: parseInt(params.id),
      searchQuery: searchQuery || null
    }
  });

  let account;
  let accounts = query(QUERIES.ACCOUNTS.ALL);
  // try to extract account object if accountId param is available
  $: accounts.result().then(r => {
    const _accounts = r.data.accounts.nodes.filter(a => a.id === parseInt(params.id));
    console.log('accounts - ', _accounts, r);
    account = _accounts.length ? _accounts[0] : null;
  })

  let formVisible = false;
  function toggleForm() {
    formVisible = !formVisible;
  }
</script>

<div>
  <h1 class='inline-block'>
    <a class='heading' href='#/accounts'>Accounts</a>
  </h1>
  {#if account}
  <span class='inline-block mx-1'>&gt;</span>
  <span class='font-bold text-green-700'>{account.bank} –– {account.number}</span>
  <button class="btn-plain btn-plain-blue ml-2 float-right" on:click={toggleForm} disabled={formVisible}>Edit Account</button>
  {/if}
  <input type='text' placeholder='Search' bind:value={searchQuery} />
</div>

{#if formVisible}
<AccountForm account={account} cancelCallback={toggleForm} />
{/if}

{#if $transactions.data}
  <TransactionList transactions={$transactions.data.transactionsSearch.nodes} />
{/if}
