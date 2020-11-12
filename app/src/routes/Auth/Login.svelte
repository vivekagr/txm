<script lang="ts">
  import { mutation } from 'svelte-apollo'
  import { replace } from 'svelte-spa-router'

  import type { Authenticate, AuthenticateVariables } from 'app/data/types/Authenticate'
  import QUERIES from 'app/queries'
  import { authToken } from 'app/stores'

  const authMutation = mutation<Authenticate, AuthenticateVariables>(QUERIES.AUTHENTICATE)

  interface LoginFormData {
    username?: string
    password?: string
  }

  const formData: LoginFormData = {}
  $: formEnabled = formData.username && formData.password

  let wrongCredentials = false

  async function handleSubmit() {
    wrongCredentials = false

    const {
      data: {
        authenticate: { jwtToken },
      },
    } = await authMutation({
      variables: {
        username: formData.username,
        password: formData.password,
      },
    })

    if (!jwtToken) {
      wrongCredentials = true
      return
    }

    authToken.set(jwtToken)
    replace('/accounts')
  }
</script>

<div class="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full">
    <div>
      <h1 class="text-center text-4xl font-hairline text-gray-700 tracking-widest">txm</h1>
      <h2 class="mt-6 text-center text-2xl leading-9 font-extrabold text-gray-900">Sign in</h2>
      <p class="mt-2 text-center text-sm leading-5 text-gray-600">
        or
        <a
          href="#/signup"
          class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
          get an account
        </a>
      </p>
    </div>
    <form class="mt-8" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm">
        <label class="block">
          <span class="text-sm font-medium leading-5 text-gray-700">Username</span>
          <input
            type="text"
            class="form-input mt-1 block w-full"
            placeholder="Username"
            aria-label="Username"
            bind:value={formData.username}
            required />
        </label>
        <label class="block mt-4">
          <span class="text-sm font-medium leading-5 text-gray-700">Password</span>
          <input
            type="password"
            class="form-input mt-1 block w-full"
            placeholder="Password"
            aria-label="Password"
            bind:value={formData.password}
            required />
        </label>
      </div>

      <div class="mt-8">
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md uppercase text-blue-500 border-blue-200 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue active:border-blue-500 transition duration-150 ease-in-out"
          disabled={!formEnabled}>
          Sign in
        </button>
      </div>

      {#if wrongCredentials}
        <div class="mt-4 text-center text-red-500 font-small text-sm">Wrong credentials</div>
      {/if}
    </form>
  </div>
</div>
