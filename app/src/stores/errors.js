import { writable } from 'svelte/store'

function itemTimeoutStore(timeout) {
  const { subscribe, update } = writable([])

  const removeOneItem = () => update((items) => items.slice(1))

  return {
    subscribe,
    add(item) {
      update((items) => items.concat(item))
      setTimeout(removeOneItem, timeout)
    },
  }
}

const errorsStore = itemTimeoutStore(5000)
export default errorsStore
