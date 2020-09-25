<script>
  import { getClient, query } from 'svelte-apollo';
  import { push } from 'svelte-spa-router';
  import QUERIES from '../queries';
  import AccountForm from './Accounts/AccountForm.svelte';

  export let params = {};

  let account;

  const client = getClient();
  let accounts = query(client, { query: QUERIES.ACCOUNTS.ALL });
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
    <a class='heading' href='#/accounts'>Accounts</a>
  </h1>
  {#if account}
  <span class='inline-block mx-1'>&gt;</span>
  <span class='font-bold text-green-700'>{account.bank} –– {account.number}</span>
  <button class="btn-plain btn-plain-blue ml-2 float-right" on:click={toggleForm} disabled={formVisible}>Edit Account</button>
  {:else}
  <button class="btn-plain ml-2 float-right" on:click={toggleForm} disabled={formVisible}>Create Account</button>
  {/if}
</div>

{#if formVisible}
<AccountForm account={account} cancelCallback={toggleForm} />
{/if}

<div class="mt-5">
  {#if account}
  <p>Bank: {account.bank}</p>
  <p>Account Number: {account.number}</p>
  <p>Currency: {account.currency.name}</p>
  <p>Type: {account.accountType.name}</p>
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
