<script>
  import { slide } from 'svelte/transition'
  import errors from './stores/errors'
</script>

<div class="fixed bottom-0 right-0">
  {#if $errors}
    {#each $errors as error}
      <div class="py-4 px-5 rounded-lg bg-red-200 text-red-800 m-5" transition:slide|local>
        {error}
      </div>
    {/each}
  {/if}
</div>
