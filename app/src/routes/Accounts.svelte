<script>
    import { getClient, query } from 'svelte-apollo';
    import { ACCOUNTS } from '../queries';
    import AccountForm from './Accounts/AccountForm.svelte';

    export let params = {};

    const client = getClient();

    let accounts = query(client, { query: ACCOUNTS });
</script>

<div>
    <h1>Accounts</h1>

    {#await $accounts}
        <p>Loading accounts...</p>
    {:then result}
        <ul>
            {#each result.data.accounts.nodes as account}
            <li>{JSON.stringify(account)}</li>
            {/each}
        </ul>
    {:catch}
        <p>Error: failed to fetch accounts</p>
    {/await}

    <AccountForm />
</div>
