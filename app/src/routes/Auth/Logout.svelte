<script>
  import { onMount } from 'svelte'
  import { replace } from 'svelte-spa-router'

  import authToken from '../../stores/auth'

  onMount(async () => {
    authToken.reset()
    replace('/login')
  })
</script>
