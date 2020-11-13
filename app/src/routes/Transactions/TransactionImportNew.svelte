<script lang="ts">
  import { query, mutation } from 'svelte-apollo'

  import type { Transaction } from 'app/data/transactions'
  import type { Accounts } from 'app/data/types/Accounts'
  import type {
    ImportTransactions,
    ImportTransactionsVariables,
  } from 'app/data/types/ImportTransactions'
  import { parseSheet } from 'app/utils/sheets'
  import QUERIES from 'app/queries'

  import TransactionList from './_TransactionList.svelte'

  export let accountId: number

  const accounts = query<Accounts>(QUERIES.ACCOUNTS.ALL)
  const transactionImportMutation = mutation<ImportTransactions, ImportTransactionsVariables>(
    QUERIES.TRANSACTION_IMPORTS.ADD
  )

  accounts.result().then((r) => {
    if (r.data?.accounts?.nodes[0]?.id) accountId = r.data.accounts.nodes[0].id
  })

  let rows: Transaction[]

  interface FileChangeEvent extends Event {
    currentTarget: EventTarget & { files: FileList | null }
  }

  async function handleFileChange(event: FileChangeEvent) {
    if (!event.currentTarget.files) return
    rows = await parseSheet(event.currentTarget.files[0])
  }

  async function uploadTransactions() {
    await transactionImportMutation({
      variables: { accountId, transactions: rows },
    })
  }
</script>

<h1><span class="heading">Import Transactions</span></h1>

<div class="mt-5">
  <div class="mr-5 mt-5 inline-block">
    <label for="account" class="text-gray-600">Select Account</label>
    <select class="form-select block mt-1" id="account" bind:value={accountId}>
      {#if $accounts.loading}
        Loading...
      {:else if $accounts.error}
        Error:
        {$accounts.error}
      {:else if $accounts.data}
        {#each $accounts.data?.accounts?.nodes || [] as a}
          <option value={a.id}>{a.bank} – {a.number} ({a.currency?.code?.toUpperCase()})</option>
        {/each}
      {/if}
    </select>
  </div>
  <div class="mr-5 mt-5 inline-block">
    <label for="file" class="text-gray-600">Select Transaction File</label>
    <input
      id="file"
      type="file"
      accept=".xls,.xlsx"
      class="block py-2 mt-1"
      on:change={handleFileChange} />
  </div>
  <button class="btn btn-green mt-5" on:click={uploadTransactions}>Upload</button>
</div>

{#if rows}
  <TransactionList transactions={rows} />
{/if}
