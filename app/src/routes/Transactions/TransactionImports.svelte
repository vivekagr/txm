<script>
  import { query, getClient } from 'svelte-apollo';
  import QUERIES from '../../queries';

  const client = getClient();
  let imports = query(client, { query: QUERIES.TRANSACTION_IMPORTS.ALL });
</script>

<h1><span class='heading'>Transaction Imports</span></h1>

<table class='table-layout mt-6 w-full'>
  <thead>
    <tr>
      <th class='border font-bold px-4 py-2'>Import Date</th>
      <th class='border font-bold px-4 py-2'>Account</th>
      <th class='border font-bold px-4 py-2'>Transactions</th>
      <th class='border font-bold px-4 py-2'></th>
    </tr>
  </thead>
  <tbody>
    {#await $imports}
      Loading...
    {:then result}
      {#each result.data.transactionImports.nodes as row}
      <tr>
        <td class='border px-4 py-2'>{(new Date(Date.parse(row.ts))).toLocaleString()}</td>
        <td class='border px-4 py-2'><a href={`#/accounts/${row.account.id}`}>{row.account.bank} - {row.account.number} - {row.account.accountType.name}</a></td>
        <td class='border px-4 py-2'>{row.transactions.totalCount}</td>
        <td class='border px-4 py-2'><a href={`#/transactions/imports/${row.id}`}>View Transactions</a></td>
      </tr>
      {/each}
    {/await}
  </tbody>
</table>
