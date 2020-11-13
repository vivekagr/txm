<script lang="ts">
  import { mutation } from 'svelte-apollo'
  import { replace } from 'svelte-spa-router'

  import type { RegisterUser, RegisterUserVariables } from 'app/data/types/RegisterUser'
  import QUERIES from 'app/queries'

  const authMutation = mutation<RegisterUser, RegisterUserVariables>(QUERIES.AUTHENTICATE)

  interface SignupFormData {
    name?: string
    username?: string
    password?: string
  }

  const formData: SignupFormData = {}
  $: formEnabled = formData.name && formData.username && formData.password

  let wrongCredentials = false

  async function handleSubmit() {
    wrongCredentials = false

    if (!formData.name || !formData.username || !formData.password) return

    const res = await authMutation({
      variables: {
        name: formData.name,
        username: formData.username,
        password: formData.password,
      },
    })

    if (res.data?.registerUser?.user?.id) {
      replace('/login')
    } else {
      wrongCredentials = true
    }
  }
</script>

<div class="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full">
    <div>
      <h1 class="text-center text-4xl font-hairline text-gray-700 tracking-widest">txm</h1>
      <h2 class="mt-6 text-center text-2xl leading-9 font-extrabold text-gray-900">Sign up</h2>
      <p class="mt-2 text-center text-sm leading-5 text-gray-600">
        <a
          href="#/register/"
          class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
          have an account?
        </a>
      </p>
    </div>
    <form class="mt-8" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm">
        <div>
          <input
            aria-label="Username"
            name="username"
            type="itext"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="Username"
            bind:value={formData.username} />
        </div>
        <div class="-mt-px">
          <input
            aria-label="Password"
            name="password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="Password"
            bind:value={formData.password} />
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
          disabled={!formEnabled}>
          Sign in
        </button>
      </div>

      {#if wrongCredentials}
        <div class="mt-4 text-center text-red-700 font-small">Wrong credentials</div>
      {/if}
    </form>
  </div>
</div>