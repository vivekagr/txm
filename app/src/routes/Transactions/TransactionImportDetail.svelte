<script>
  import { query, getClient } from 'svelte-apollo';
  import TransactionList from './_TransactionList.svelte';
  import QUERIES from '../../queries';

  export let params = {};

  const client = getClient();
  let transactionImport = query(client, {
    query: QUERIES.TRANSACTION_IMPORTS.ONE,
    variables: { id: parseInt(params.id) }
  });
</script>

<div>
  <h1 class='inline-block'><a href='#/transactions/imports/' class='heading'>Transaction Imports</a></h1>
  {#await $transactionImport then response}
  <span class='inline-block mx-1'>&gt;</span>
  <span class='font-bold text-green-700'>{response.data.transactionImport.account.bank} –– {response.data.transactionImport.account.number}</span>
  {/await}
</div>

{#await $transactionImport then response}
  <TransactionList transactions={response.data.transactionImport.transactions.nodes} />
{/await}
