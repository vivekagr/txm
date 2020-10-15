<script>
  import { query } from 'svelte-apollo';
  import { push } from 'svelte-spa-router';
  import QUERIES from '../queries';
  import AccountForm from './Accounts/AccountForm.svelte';

  const accounts = query(QUERIES.ACCOUNTS.ALL);

  let formVisible = false;
  function toggleForm() {
    formVisible = !formVisible;
  }
</script>

<div>
  <h1 class='inline-block'>
    <a class='heading' href='#/accounts'>Accounts</a>
  </h1>
  <button class="btn-plain ml-2 float-right" on:click={toggleForm} disabled={formVisible}>Create Account</button>
</div>

{#if formVisible}
  <AccountForm cancelCallback={toggleForm} />
{/if}

<div class="mt-5">
  {#if $accounts.loading}
    <p>Loading accounts...</p>
  {:else if $accounts.error}
    <p>Error: {$accounts.error}</p>
  {:else if $accounts.data}
    <ul class="grid grid-cols-3 gap-4 justify-items-auto">
      {#each $accounts.data.accounts.nodes as account}
      <li on:click={() => push(`#/accounts/${account.id}/`)} class="block border rounded border-gray-400 px-4 py-3 cursor-pointer transition-colors duration-200 hover:border-gray-600">
        <div class="inline-block text-blue-700 text-md font-semibold rounded">{account.bank}</div>
        <div class="block font-semibold text-sm mt-2">
          {account.accountType.name}
          <span class="text-green-700 uppercase">– {account.currency.code}</span>
        </div>
        <div class="mt-2">{account.number}</div>
      </li>
      {/each}
    </ul>
  {/if}
</div>
