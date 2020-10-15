<script>
  import { query } from 'svelte-apollo';
  import TransactionList from './_TransactionList.svelte';
  import QUERIES from '../../queries';

  export let params = {};

  let transactionImport = query(QUERIES.TRANSACTION_IMPORTS.ONE, {
    variables: { id: parseInt(params.id) }
  });
</script>

<div>
  <h1 class='inline-block'><a href='#/transactions/imports/' class='heading'>Transaction Imports</a></h1>
  {#if $transactionImport.data}
  <span class='inline-block mx-1'>&gt;</span>
  <span class='font-bold text-green-700'>{$transactionImport.data.transactionImport.account.bank} –– {$transactionImport.data.transactionImport.account.number}</span>
  {/if}
</div>

{#if $transactionImport.data}
  <TransactionList transactions={$transactionImport.data.transactionImport.transactions.nodes} />
{/if}
