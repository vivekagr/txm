<script lang="ts">
  import { query } from 'svelte-apollo'

  import QUERIES from 'app/queries'
  import type { Account, AccountVariables } from 'app/data/types/Account'
  import type {
    TransactionsSearch,
    TransactionsSearchVariables,
  } from 'app/data/types/TransactionsSearch'

  import TransactionList from '../Transactions/_TransactionList.svelte'
  import AccountForm from './AccountForm.svelte'

  interface AccountDetailParams {
    id?: string
  }

  export let params: AccountDetailParams = {}

  let searchQuery: string | null = null

  const account = query<Account, AccountVariables>(QUERIES.ACCOUNTS.ONE, {
    variables: {
      id: parseInt(params.id, 10),
    },
  })

  $: transactions = query<TransactionsSearch, TransactionsSearchVariables>(
    QUERIES.TRANSACTION.SEARCH,
    {
      variables: {
        accountId: parseInt(params.id, 10),
        searchQuery: searchQuery || null,
      },
    }
  )

  let formVisible = false
  function toggleForm() {
    formVisible = !formVisible
  }
</script>

<div>
  <h1 class="inline-block"><a class="heading" href="#/accounts">Accounts</a></h1>
  {#if $account.data}
    <span class="inline-block mx-1">&gt;</span>
    <span class="font-bold text-green-700">{$account.data.account.bank}
      ––
      {$account.data.account.number}</span>
    <button
      class="btn-plain btn-plain-blue ml-2 float-right"
      on:click={toggleForm}
      disabled={formVisible}>Edit Account</button>
  {/if}
  <input type="text" placeholder="Search" bind:value={searchQuery} />
</div>

{#if formVisible}
  <AccountForm account={$account.data.account} cancelCallback={toggleForm} />
{/if}

{#if $transactions.data}
  <TransactionList transactions={$transactions.data.transactionsSearch.nodes} />
{/if}
