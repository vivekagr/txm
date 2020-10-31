<script>
  import { onMount } from 'svelte'
  import { replace } from 'svelte-spa-router'

  import authToken from 'app/stores/auth'

  onMount(async () => {
    authToken.reset()
    replace('/login')
  })
</script>
