import { writable, Readable } from 'svelte/store'

export interface TimeoutStore<T> extends Readable<T[]> {
  add: (value: T) => void
}

export function timeoutStore<T>(timeout: number): TimeoutStore<T> {
  const { subscribe, update } = writable<T[]>([])

  const removeOneItem = () => update((items) => items.slice(1))

  return {
    subscribe,
    add(item: T) {
      update((items) => items.concat(item))
      setTimeout(removeOneItem, timeout)
    },
  }
}
