<script>
  import { query, getClient } from 'svelte-apollo';
  import QUERIES from '../../queries';

  const client = getClient();
  let imports = query(client, { query: QUERIES.TRANSACTION_IMPORTS.ALL });
</script>

<div>
  <a href='#/transactions/imports/new' class="btn-plain ml-2 float-right">New Import</a>
  <h1><a href='#/transactions/imports/' class='heading'>Transaction Imports</a></h1>
</div>

<table class='table-layout mt-6 w-full'>
  <thead class='text-left font-bold'>
    <tr class='border-b-2'>
      <th class='p-4'>Import Date</th>
      <th class='p-4'>Account</th>
      <th class='p-4'>Transactions</th>
      <th class='p-4'></th>
    </tr>
  </thead>
  <tbody>
    {#await $imports}
      Loading...
    {:then result}
      {#each result.data.transactionImports.nodes as row}
      <tr class='border-b'>
        <td class='p-4'>{(new Date(Date.parse(row.ts))).toLocaleString()}</td>
        <td class='p-4'>
          <a class='btn-plain btn-plain-blue' href={`#/accounts/${row.account.id}`}>
            {row.account.bank} - {row.account.number} - {row.account.accountType.name
          }</a>
        </td>
        <td class='p-4'>{row.transactions.totalCount}</td>
        <td class='p-4'>
          <a class='btn-plain btn-plain-blue' href={`#/transactions/imports/${row.id}`}>Import Details</a>
        </td>
      </tr>
      {/each}
    {/await}
  </tbody>
</table>
