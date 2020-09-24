<script>
    import { getClient, query } from 'svelte-apollo';
    import { push } from 'svelte-spa-router';
    import { ACCOUNTS } from '../queries';
    import AccountForm from './Accounts/AccountForm.svelte';

    export let params = {};

    let account;

    const client = getClient();
    let accounts = query(client, { query: ACCOUNTS });
    // try to extract account object if accountId param is available
    $: accounts.result().then(r => {
        if (!params.accountId) return null;
        const _accounts = r.data.accounts.nodes.filter(a => a.id == params.accountId);
        account = _accounts.length ? _accounts[0] : null;
    })

    let formVisible = false;
    function toggleForm() {
        formVisible = !formVisible;
    }
</script>

<div>
    <h1 class='inline-block'>
        <a class="inline-block text-lg font-bold border-b-2 border-gray-400 pr-1 hover:border-green-600 transition-colors duration-200" href="#/accounts">Accounts</a>
    </h1>
    {#if account}
    <span class='inline-block mx-1'>&gt;</span>
    <span class='font-bold text-green-700'>{account.bank}-{account.number}</span>
    <button class="inline-block float-right text-xs bg-blue-200 text-blue-600 px-2 py-1 ml-2 rounded border-blue-400 border-b" on:click={toggleForm}>Edit Account</button>
    {:else}
    <button class="inline-block float-right font-bold uppercase text-sm text-green-500 ml-2 border-b-2 border-green-200 hover:border-green-700 hover:text-green-700 transition-colors duration-200" on:click={toggleForm}>Create Account</button>
    {/if}
</div>

{#if formVisible}
    <AccountForm account={account} />
{/if}

<div class="mt-5">
{#if account}
abc
{:else}
    {#await $accounts}
        <p>Loading accounts...</p>
    {:then result}
        <ul class="grid grid-cols-3 gap-4 justify-items-auto">
            {#each result.data.accounts.nodes as account}
            <li on:click={() => push(`#/accounts/${account.id}/`)} class="block border rounded border-gray-400 px-4 py-3 cursor-pointer transition-colors duration-200 hover:border-gray-600">
                <div class="inline-block text-blue-700 text-md font-semibold rounded">{account.bank}</div>
                <div class="block font-semibold text-sm mt-2">
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
{/if}
</div>
