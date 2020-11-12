<script lang="ts">
  import type { Transaction } from 'app/data/transactions'

  export let transactions: Transaction[]
</script>

<table class="table-layout w-full mt-6">
  <thead>
    <tr>
      <th class="border font-bold px-4 py-2">Date</th>
      <th class="border font-bold px-4 py-2">Narration</th>
      <th class="border font-bold px-4 py-2">Reference</th>
      <th class="border font-bold px-4 py-2">Credit</th>
      <th class="border font-bold px-4 py-2">Debit</th>
      <th class="border font-bold px-4 py-2">Category</th>
    </tr>
  </thead>
  <tbody>
    {#each transactions as tx}
      <tr>
        <td class="border px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
        <td class="border px-4 py-2">{tx.narrationText}</td>
        <td class="border px-4 py-2">{tx.referenceText}</td>
        <td class="border px-4 py-2">{tx.isCredit ? tx.amount : ''}</td>
        <td class="border px-4 py-2">{!tx.isCredit ? tx.amount : ''}</td>
        <td class="border px-4 py-2" />
      </tr>
    {/each}
  </tbody>
</table>
