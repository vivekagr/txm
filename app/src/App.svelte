<script>
	import XLSX from 'xlsx';
	import { extractTransactionsFromSheet } from './utils'

	let files;
	let sheet;

	const readFileAsync = file => new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	})

	async function parseSheet(file) {
		const data = await readFileAsync(file);
		const workbook = XLSX.read(data, {type: 'array'});
		sheet = workbook.Sheets[workbook.SheetNames[0]];
	}

	// window.utilz = XLSX.utils;

	$: if (files && files.length) {
		parseSheet(files[0]);
	}

	$: console.log(sheet ? extractTransactionsFromSheet(sheet) : null);

</script>

<main>
	<input type='file' bind:files />

	{#if sheet}
		{sheet}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>