<script>
    import { getClient, query } from 'svelte-apollo';
    import { push } from 'svelte-spa-router';
    import { ACCOUNTS } from '../queries';
    import AccountForm from './Accounts/AccountForm.svelte';

    export let params = {};

    const client = getClient();

    let accounts = query(client, { query: ACCOUNTS });
</script>

<h1 class="inline-block text-lg font-bold border-b-2 border-gray-400 pr-2">Accounts</h1>

<div class="mt-5">
    {#await $accounts}
        <p>Loading accounts...</p>
    {:then result}
        <ul class="grid grid-cols-3 gap-4 justify-items-auto">
            {#each result.data.accounts.nodes as account}
            <li on:click={() => push(`#/accounts/${account.id}/`)} class="block border rounded border-gray-400 px-4 py-3 cursor-pointer transition-colors duration-200 hover:border-gray-600">
                <div class="inline-block text-blue-700 text-md font-semibold rounded">{account.bank}</div>
                <div class="block font-semibold text-sm">
                    {account.accountType.name}
                    <span class="text-green-700 uppercase">– {account.currency.code}</span>
                </div>
                <div class="mt-2">{account.number} </div>
            </li>
            {/each}
        </ul>
    {:catch}
        <p>Error: failed to fetch accounts</p>
    {/await}
</div>

<AccountForm />
