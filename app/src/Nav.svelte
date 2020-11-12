<script context="module" lang="ts">
  interface RouteDefinition {
    uri: string
    text: string
  }

  const USER_NAV: RouteDefinition[] = [
    {
      uri: '/transactions/imports',
      text: 'Imports',
    },
    {
      uri: '/accounts',
      text: 'Accounts',
    },
  ]

  const ANON_NAV: RouteDefinition[] = [
    {
      uri: '/signup',
      text: 'Signup',
    },
    {
      uri: '/login',
      text: 'Login',
    },
  ]

  interface DropdownParams {
    duration: number
    in?: boolean
  }

  function dropdown(
    _node: HTMLElement,
    { duration, in: isIn = false }: DropdownParams
  ): TransitionConfig {
    return {
      duration,
      css: (t: number): string => {
        const eased = isIn ? sineIn(t) : sineOut(t)

        return `
          transform: scale(${0.95 + eased * 0.05});
          opacity: ${eased};
        `
      },
    }
  }
</script>

<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition'
  import { sineIn, sineOut } from 'svelte/easing'
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import { authToken } from './stores'

  $: nav = $authToken ? USER_NAV : ANON_NAV

  let profileDropdownVisible = false
  function toggleProfileDropdown() {
    profileDropdownVisible = !profileDropdownVisible
  }

  function windowClick() {
    if (profileDropdownVisible) {
      profileDropdownVisible = false
    }
  }
</script>

<svelte:window on:click={windowClick} />

<nav class="border-b-2 border-gray-200">
  <div class="container mx-auto flex h-12 items-center justify-between">
    <div class="flex items-center">
      <div class="px-2 font-hairline tracking-widest">txm</div>
    </div>

    <div class="hidden md:flex items-center">
      <ul>
        {#each nav as item}
          <li class="inline-block">
            <a
              class="inline-block px-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              use:link
              use:active={{ className: 'text-gray-900' }}
              href={item.uri}>
              {item.text}
            </a>
          </li>
        {/each}
      </ul>
      {#if $authToken}
        <div class="ml-4 flex items-center md:ml-6">
          <!-- Profile dropdown -->
          <div class="h-6 w-6 relative">
            <button
              on:click|stopPropagation={toggleProfileDropdown}
              class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-700 transition-colors duration-200"
              id="user-menu"
              aria-label="User menu"
              aria-haspopup="true">
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {#if profileDropdownVisible}
              <div
                class="origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg"
                in:dropdown={{ duration: 100 }}
                out:dropdown={{ duration: 75, in: true }}>
                <div
                  class="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu">
                  <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a> -->
                  <a
                    href="/settings"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">Settings</a>
                  <a
                    href="/logout"
                    use:link
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">Logout</a>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    <div class="-mr-2 flex md:hidden">
      <!-- Mobile menu button -->
      <button
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
        <!-- Menu open: "hidden", Menu closed: "block" -->
        <svg class="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <!-- Menu open: "block", Menu closed: "hidden" -->
        <svg class="hidden h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</nav>
