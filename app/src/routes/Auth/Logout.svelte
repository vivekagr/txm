<script lang="ts">
  import { onMount } from 'svelte'
  import { replace } from 'svelte-spa-router'

  import { authToken } from 'app/stores'

  onMount(async () => {
    authToken.reset()
    replace('/login')
  })
</script>
