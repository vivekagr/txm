<script>
  import { onMount } from 'svelte'
  import { query, mutation } from 'svelte-apollo'

  import QUERIES from 'app/queries'

  export let account = null
  export let cancelCallback = null

  let formData = {}
  $: formEnabled = formData.number && formData.bank && formData.currencyId && formData.accountTypeId

  if (account) {
    formData = {
      bank: account.bank,
      number: account.number,
      currencyId: account.currency.id,
      accountTypeId: account.accountType.id,
    }
  }

  const currencies = query(QUERIES.CURRENCIES.ALL)
  const accountTypes = query(QUERIES.ACCOUNT_TYPES.ALL)

  const createAccountMutation = mutation(QUERIES.ACCOUNTS.CREATE)
  const updateAccountMutation = mutation(QUERIES.ACCOUNTS.UPDATE)

  currencies.result().then((r) => {
    formData.currencyId = account ? account.currency.id : r.data.currencies.nodes[0].id
  })
  accountTypes.result().then((r) => {
    formData.accountTypeId = account ? account.accountType.id : r.data.accountTypes.nodes[0].id
  })

  async function handleSubmit() {
    if (account) {
      await updateAccountMutation({
        variables: {
          ...formData,
          id: account.id,
        },
      })
    } else {
      await createAccountMutation({
        variables: formData,
        update: (cache, { data }) => {
          const existingAccounts = cache.readQuery({ query: QUERIES.ACCOUNTS.ALL })
          const newAccount = data.createAccount.account
          cache.writeQuery({
            query: QUERIES.ACCOUNTS.ALL,
            data: {
              accounts: {
                ...existingAccounts.accounts,
                nodes: [newAccount, ...existingAccounts.accounts.nodes],
                totalCount: existingAccounts.accounts.totalCount + 1,
              },
            },
          })
        },
      })
    }
    if (cancelCallback) cancelCallback()
  }

  // Focus first field on mount
  let firstInput
  onMount(() => firstInput.focus())
</script>

<div class="border-gray-400 border rounded px-4 py-3 my-6">
  <h2 class="text-sm text-green-700 font-bold">Create Account</h2>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="mr-5 mt-5 ml-0 inline-block">
      <label class="text-md text-gray-600" for="bank-name">Bank</label>
      <input
        type="text"
        id="bank-name"
        class="form-input block mt-1"
        bind:this={firstInput}
        bind:value={formData.bank}
        placeholder="E Corp" />
    </div>

    <div class="mr-5 mt-5 inline-block">
      <label class="text-gray-600" for="account-number">Account Number</label>
      <input
        type="text"
        id="account-number"
        class="form-input block mt-1"
        bind:value={formData.number}
        placeholder="9876543210" />
    </div>

    <div class="mr-5 mt-5 inline-block">
      <label for="currency" class="text-gray-600">Currency</label>
      <select id="currency" class="form-select block mt-1" bind:value={formData.currencyId}>
        {#if $currencies.loading}
          Loading...
        {:else if $currencies.data}
          {#each $currencies.data.currencies.nodes as currency}
            <option value={currency.id}>{currency.name}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="mr-5 mt-5 inline-block">
      <label for="account-type" class="text-gray-600">Account Type</label>
      <select class="form-select block mt-1" bind:value={formData.accountTypeId} id="account-type">
        {#if $accountTypes.loading}
          Loading...
        {:else if $accountTypes.data}
          {#each $accountTypes.data.accountTypes.nodes as accountType}
            <option value={accountType.id}>{accountType.name}</option>
          {/each}
        {/if}
      </select>
    </div>

    <button
      class={account ? 'mt-5 btn btn-blue' : 'mt-5 btn btn-green'}
      type="submit"
      disabled={!formEnabled}>
      {account ? 'Update' : 'Create'}
    </button>
    <button class="btn mt-5 ml-1" type="button" on:click={cancelCallback}>Cancel</button>
  </form>
</div>
