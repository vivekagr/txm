<script>
  import { setClient } from 'svelte-apollo';
  import Router from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import TailwindCss from './TailwindCss.svelte';

  import routes from './routes/';
  import { client } from './apollo';

  setClient(client);

  const nav = [
  {
    uri: '#/transactions/imports/new',
    text: 'Import'
  },
  {
    uri: '#/transactions/imports/',
    text: 'Imports'
  },
  {
    uri: '#/accounts/',
    text: 'Accounts'
  }
  ]
</script>

<TailwindCss />
<nav class="border-b-2 border-gray-200">
  <div class="container mx-auto flex justify-between">
    <div class="px-2 py-3">txm</div>
    <ul>
      {#each nav as item}
      <li class="inline-block">
        <a class="inline-block p-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200" use:active={{className: 'text-gray-900'}} href={item.uri}>{item.text}</a>
      </li>
      {/each}
    </ul>
  </div>
</nav>
<div class="container mx-auto mt-5 mb-10">
  <Router {routes} />
</div>
