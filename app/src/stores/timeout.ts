import { writable, Readable } from 'svelte/store'

export interface TimeoutStore extends Readable<any> {
  add: (value: any) => void
}

export function timeoutStore(timeout: number): TimeoutStore {
  const { subscribe, update } = writable([])

  const removeOneItem = () => update((items) => items.slice(1))

  return {
    subscribe,
    add(item: any) {
      update((items) => items.concat(item))
      setTimeout(removeOneItem, timeout)
    },
  }
}
