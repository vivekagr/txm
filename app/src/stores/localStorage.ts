/**
 * Svelte store backed by localStorage.
 *
 * Inspired by - https://gist.github.com/joshnuss/aa3539daf7ca412202b4c10d543bc077
 */

import { writable as baseWritable, Writable } from 'svelte/store'

export interface LocalStorageStore extends Writable<any> {
  get: () => any
  reset: () => void
}

export function localStorageStore(key: string, defaultValue: any = null): LocalStorageStore {
  // Initialise writable store with given default value
  const store = baseWritable(defaultValue)

  // Check existing value in localStorage
  const existingValue = localStorage.getItem(key)
  if (existingValue) store.set(JSON.parse(existingValue))
  else localStorage.setItem(key, JSON.stringify(defaultValue))

  return {
    set(value: any) {
      localStorage.setItem(key, JSON.stringify(value))
      store.set(value)
    },
    get(): any {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    },
    reset() {
      this.set(defaultValue)
    },
    update(cb: (v: any) => any) {
      this.set(cb(this.get()))
    },
    subscribe: store.subscribe,
  }
}
