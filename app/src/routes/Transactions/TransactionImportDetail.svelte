<script lang="ts">
  import { query } from 'svelte-apollo'

  import QUERIES from 'app/queries'
  import type {
    TransactionImport,
    TransactionImportVariables,
  } from 'app/data/types/TransactionImport'

  import TransactionList from './_TransactionList.svelte'

  export let params: { id: string }

  const transactionImport = query<TransactionImport, TransactionImportVariables>(
    QUERIES.TRANSACTION_IMPORTS.ONE,
    {
      variables: { id: parseInt(params.id, 10) },
    }
  )
</script>

<div>
  <h1 class="inline-block">
    <a href="#/transactions/imports/" class="heading">Transaction Imports</a>
  </h1>
  {#if $transactionImport.data}
    <span class="inline-block mx-1">&gt;</span>
    <span class="font-bold text-green-700">{$transactionImport.data.transactionImport.account.bank}
      ––
      {$transactionImport.data.transactionImport.account.number}</span>
  {/if}
</div>

{#if $transactionImport.data}
  <TransactionList transactions={$transactionImport.data.transactionImport.transactions.nodes} />
{/if}
