<script lang="ts">
  import { setClient } from 'svelte-apollo'
  import Router from 'svelte-spa-router'
  import TailwindCss from './TailwindCss.svelte'

  import { routes, conditionsFailed } from './routes'
  import apolloClient from './apollo'
  import Nav from './Nav.svelte'
  import Errors from './Errors.svelte'

  setClient(apolloClient)
</script>

<TailwindCss />

<Nav />

<div class="container mx-auto mt-5 mb-10">
  <Router {routes} on:conditionsFailed={conditionsFailed} />
</div>

<Errors />
