<script>
    import { onMount } from 'svelte';
    import { getClient, query, mutate } from 'svelte-apollo';
    import { CURRENCIES, ACCOUNT_TYPES, ACCOUNTS, ADD_ACCOUNT } from '../../queries';

    export let account;

    let formData = {};
    $: formEnabled = formData.number && formData.bank && formData.currencyId && formData.accountTypeId;

    if (account) {
        formData = {
            bank: account.bank,
            number: account.number,
            currencyId: account.currency.id,
            accountTypeId: account.accountType.id
        }
    }

    const client = getClient();
    let currencies = query(client, { query: CURRENCIES });
    let accountTypes = query(client, { query: ACCOUNT_TYPES });
    currencies.result().then(r => {
        formData.currencyId = account ? account.currency.id : r.data.currencies.nodes[0].id;
    });
    accountTypes.result().then(r => {
        formData.accountTypeId = account ? account.accountType.id : r.data.accountTypes.nodes[0].id;
    });

    async function handleSubmit() {
        const res = await mutate(client, {
            mutation: ADD_ACCOUNT,
            variables: formData,
            update: (cache, {data}) => {
                const existingAccounts = cache.readQuery({ query: ACCOUNTS });
                const newAccount = data.createAccount.account;
                cache.writeQuery({
                    query: ACCOUNTS,
                    data: {
                        accounts: {
                            nodes: [newAccount, ...existingAccounts.accounts.nodes],
                            totalCount: existingAccounts.accounts.totalCount + 1,
                            __typename: existingAccounts.accounts.__typename
                        },
                    }
                });
            }
        })
    }

    // Focus first field on mount
    let firstInput;
    onMount(() => firstInput.focus());
</script>

<div class='border-gray-400 border rounded px-4 py-3 my-6'>
    <h2 class='text-sm text-green-700 font-bold'>Create Account</h2>

    <form on:submit|preventDefault={handleSubmit}>
        <div class='mr-5 mt-5 ml-0 inline-block'>
            <label class='text-md text-gray-600' for='bank-name'>Bank</label>
            <input
                type='text'
                id='bank-name'
                class='form-input block mt-1'
                bind:this={firstInput}
                bind:value={formData.bank}
                placeholder='E Corp'
            />
        </div>

        <div class='mr-5 mt-5 inline-block'>
            <label class='text-gray-600' for='account-number'>Account Number</label>
            <input
                type='text'
                id='account-number'
                class='form-input block mt-1'
                bind:value={formData.number}
                placeholder='9876543210'
            />
        </div>

        <div class='mr-5 mt-5 inline-block'>
            <label for='currency' class='text-gray-600'>Currency</label>
            <select id='currency' class='form-select block mt-1' bind:value={formData.currencyId}>
                {#await $currencies}
                Loading...
                {:then result}
                    {#each result.data.currencies.nodes as currency}
                    <option value={currency.id}>{currency.name}</option>
                    {/each}
                {/await}
            </select>
        </div>

        <div class='mr-5 mt-5 inline-block'>
            <label for='account-type' class='text-gray-600'>Account Type</label>
            <select class='form-select block mt-1' bind:value={formData.accountTypeId} id='account-type'>
                {#await $accountTypes}
                Loading...
                {:then result}
                    {#each result.data.accountTypes.nodes as accountType}
                    <option value={accountType.id}>{accountType.name}</option>
                    {/each}
                {/await}
            </select>
        </div>

        <button class='mt-5 inline-block px-4 py-2 disabled:opacity-50 bg-green-200 text-green-500 border-green-400 border-b rounded hover:text-green-600 hover:border-green-600 transition-colors duration-200' type='submit' disabled={!formEnabled}>
            Create
        </button>
    </form>
</div>
