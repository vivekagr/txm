<script>
  import { query } from 'svelte-apollo'

  import QUERIES from 'app/queries'

  const imports = query(QUERIES.TRANSACTION_IMPORTS.ALL)
</script>

<div>
  <a href="#/transactions/imports/new" class="btn-plain ml-2 float-right">New Import</a>
  <h1><a href="#/transactions/imports/" class="heading">Transaction Imports</a></h1>
</div>

<table class="table-layout mt-6 w-full">
  <thead class="text-left font-bold">
    <tr class="border-b-2">
      <th class="p-4">Import Date</th>
      <th class="p-4">Account</th>
      <th class="p-4">Transactions</th>
      <th class="p-4" />
    </tr>
  </thead>
  <tbody>
    {#if $imports.loading}
      Loading...
    {:else if $imports.data}
      {#each $imports.data.transactionImports.nodes as row}
        <tr class="border-b">
          <td class="p-4">{new Date(Date.parse(row.ts)).toLocaleString()}</td>
          <td class="p-4">
            <a class="btn-plain btn-plain-blue" href={`#/accounts/${row.account.id}`}>
              {row.account.bank}
              -
              {row.account.number}
              -
              {row.account.accountType.name}</a>
          </td>
          <td class="p-4">{row.transactions.totalCount}</td>
          <td class="p-4">
            <a class="btn-plain btn-plain-blue" href={`#/transactions/imports/${row.id}`}>Import
              Details</a>
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
