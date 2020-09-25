<script>
  export let transactions;
</script>

<table class='table-layout mt-6'>
  <thead>
    <tr>
      <td class='border font-bold px-4 py-2'>Date</td>
      <td class='border font-bold px-4 py-2'>Narration</td>
      <td class='border font-bold px-4 py-2'>Reference</td>
      <td class='border font-bold px-4 py-2'>Credit</td>
      <td class='border font-bold px-4 py-2'>Debit</td>
      <td class='border font-bold px-4 py-2'>Category</td>
    </tr>
  </thead>
  <tbody>
    {#each transactions as tx}
    <tr>
      <td class='border px-4 py-2'>{tx.date}</td>
      <td class='border px-4 py-2'>{tx.narrationText}</td>
      <td class='border px-4 py-2'>{tx.referenceText}</td>
      <td class='border px-4 py-2'>{tx.isCredit ? tx.amount : ''}</td>
      <td class='border px-4 py-2'>{!tx.isCredit ? tx.amount : ''}</td>
      <td class='border px-4 py-2'></td>
    </tr>
    {/each}
  </tbody>
</table>
