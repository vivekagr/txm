<script>
	import XLSX from 'xlsx';
	import { extractTransactionsFromSheet, transformTransactionList } from './utils'

	let rows;

	const readFileAsArrayBufferAsync = file => new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	})

	async function parseSheet(file) {
		// read given file as ArrayBuffer
		const dataArrayBuffer = await readFileAsArrayBufferAsync(file);
		// read the file as workbook & get the main sheet
		const workbook = XLSX.read(dataArrayBuffer, {type: 'array', raw: true });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];

		// extract transaction from the sheet (that might contain non-transaction information)
		// and transform+clean it into a usable data
		const { headers, data } = extractTransactionsFromSheet(sheet);
		rows = transformTransactionList(headers, data);
	}

	function handleFileChange(e) {
		parseSheet(e.target.files[0]);
	}

</script>

<main>
	<input
		type='file'
		accept='.xls,.xlsx'
		on:change={handleFileChange}
	/>

	{#if rows}
		<table>
			<thead>
				<tr>
					<td>date</td>
					<td>narration</td>
					<td>reference</td>
					<td>credit</td>
					<td>debit</td>
				</tr>
			</thead>
			<tbody>
				{#each rows as row}
				<tr>
					<td>{row.date}</td>
					<td>{row.narration}</td>
					<td>{row.reference}</td>
					<td>{row.isCredit ? row.amount : ''}</td>
					<td>{!row.isCredit ? row.amount : ''}</td>
				</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 960px;
		margin: 0 auto;
	}
</style>