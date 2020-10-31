<script>
  import XLSX from 'xlsx'
  import { query, mutation } from 'svelte-apollo'
  import QUERIES from '../../queries'
  import { extractTransactionsFromSheet, transformTransactionList } from './utils'
  import TransactionList from './_TransactionList.svelte'

  export let accountId

  const accounts = query(QUERIES.ACCOUNTS.ALL)
  const transactionImportMutation = mutation(QUERIES.TRANSACTION_IMPORTS.ADD)

  accounts.result().then((r) => {
    if (!accountId && r.data.accounts.nodes.length) accountId = r.data.accounts.nodes[0].id
  })

  let rows

  const readFileAsArrayBufferAsync = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })

  async function parseSheet(file) {
    // read given file as ArrayBuffer
    const dataArrayBuffer = await readFileAsArrayBufferAsync(file)
    // read the file as workbook & get the main sheet
    const workbook = XLSX.read(dataArrayBuffer, { type: 'array', raw: true })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    // extract transaction from the sheet (that might contain non-transaction information)
    // and transform+clean it into a usable data
    const { headers, data } = extractTransactionsFromSheet(sheet)
    rows = transformTransactionList(headers, data)
  }

  function handleFileChange(e) {
    parseSheet(e.target.files[0])
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
        {#each $accounts.data.accounts.nodes as a}
          <option value={a.id}>{a.bank} – {a.number} ({a.currency.code.toUpperCase()})</option>
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
