<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .heading {
    @apply inline-block pr-1 text-lg font-bold border-b-2 border-gray-400 transition-colors duration-200;
  }
  a.heading:hover { @apply border-green-600; }

  .btn {
    @apply mt-5 inline-block px-4 py-2 bg-gray-100 text-gray-500 border-gray-400 border-b rounded transition-colors duration-200;
  }
  .btn:focus { outline: none; }
  .btn:hover { @apply text-gray-600 border-gray-600; }
  .btn:disabled, .btn:disabled:hover { @apply bg-gray-200 text-gray-400 border-gray-400; }

  .btn-green { @apply bg-green-200 text-green-500 border-green-400; }
  .btn-green:hover { @apply text-green-600 border-green-600; }

  .btn-blue { @apply bg-blue-200 text-blue-500 border-blue-400; }
  .btn-blue:hover { @apply text-blue-600 border-blue-600; }

  .btn-plain {
    @apply inline-block font-bold uppercase text-sm border-b-2 text-green-500 border-green-200 transition-colors duration-150;
  }
  .btn-plain:focus { outline: none; }
  .btn-plain:hover { @apply border-green-700 text-green-700; }
  .btn-plain:disabled, .btn-plain:disabled:hover { @apply text-gray-400 border-gray-400; }

  .btn-plain-green { @apply text-green-500 border-green-200; }
  .btn-plain-green:hover { @apply border-green-700 text-green-700; }

  .btn-plain-blue { @apply text-blue-500 border-blue-200; }
  .btn-plain-blue:hover { @apply border-blue-700 text-blue-700; }
</style>
