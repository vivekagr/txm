<script lang="ts">
  import { mutation } from 'svelte-apollo'
  import { replace } from 'svelte-spa-router'
  import { ApolloError, isApolloError } from '@apollo/client'

  import type { RegisterUser, RegisterUserVariables } from 'app/data/types/RegisterUser'
  import QUERIES from 'app/queries'

  const authMutation = mutation<RegisterUser, RegisterUserVariables>(QUERIES.REGISTER)

  interface SignupFormData {
    name?: string
    username?: string
    password?: string
  }

  const formData: SignupFormData = {}
  $: formEnabled = formData.name && formData.username && formData.password

  let error: string | null

  async function handleSubmit() {
    error = null

    if (!formData.name || !formData.username || !formData.password) return

    try {
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
        error = 'Unable to register'
      }
    } catch (e) {
      if (isApolloError(e)) {
        console.log(e.graphQLErrors[0].errcode)
      }
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
        <label class="block">
          <span class="text-sm font-medium leading-5 text-gray-700">Name</span>
          <input
            type="text"
            class="form-input mt-1 block w-full"
            placeholder="Name"
            aria-label="Name"
            bind:value={formData.name}
            required />
        </label>
        <label class="block mt-4">
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
          Sign up
        </button>
      </div>

      {#if error}
        <div class="mt-4 text-center text-red-700 font-small">Unable to register</div>
      {/if}
    </form>
  </div>
</div>
