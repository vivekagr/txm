<script>
    import { getClient, query, mutate } from 'svelte-apollo';
    import { CURRENCIES, ACCOUNT_TYPES, ACCOUNTS, ADD_ACCOUNT } from '../../queries';

    let number, bank, currencyId, accountTypeId;
    $: formEnabled = number && bank && currencyId && accountTypeId;

    const client = getClient();

    let currencies = query(client, { query: CURRENCIES });
    currencies.result().then(r => { currencyId = r.data.currencies.nodes[0].id });

    let accountTypes = query(client, { query: ACCOUNT_TYPES });
    accountTypes.result().then(r => { accountTypeId = r.data.accountTypes.nodes[0].id });

    async function handleSubmit() {
        const res = await mutate(client, {
            mutation: ADD_ACCOUNT,
            variables: { bank, number, currencyId, accountTypeId },
            update: (cache, {data}) => {
                const existingAccounts = cache.readQuery({ query: ACCOUNTS });
                const newAccount = data.createAccount.account;
                cache.writeQuery({
                    query: ACCOUNTS,
                    data: {
                        accounts: {
                            nodes: [...existingAccounts.accounts.nodes, newAccount],
                            totalCount: existingAccounts.accounts.totalCount + 1,
                            __typename: existingAccounts.accounts.__typename
                        },
                    }
                });
            }
        })
    }
</script>

{accountTypeId}

<form on:submit|preventDefault={handleSubmit}>
    <input type='text' bind:value={bank} placeholder='Bank Name' />
    <input type='text' bind:value={number} placeholder='Account Number' />

    <select bind:value={currencyId} disabled={!currencyId}>
        {#await $currencies}
           Loading...
        {:then result}
            {#each result.data.currencies.nodes as currency}
            <option value={currency.id} selected={2 === currency.id}>{currency.name}</option>
            {/each}
        {/await}
    </select>

    <select bind:value={accountTypeId} disabled={!accountTypeId}>
        {#await $accountTypes}
        Loading...
        {:then result}
            {#each result.data.accountTypes.nodes as accountType}
            <option value={accountType.id}>{accountType.name}</option>
            {/each}
        {/await}
    </select>

    <button type='submit' disabled={!formEnabled}>Submit</button>
</form>

<style>
    form {
        display: block;
        padding: 20px 50px;
        margin-top: 30px;
        border: 1px solid gray;
    }
</style>
