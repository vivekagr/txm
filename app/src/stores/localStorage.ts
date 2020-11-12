/**
 * Svelte store backed by localStorage.
 *
 * Inspired by - https://gist.github.com/joshnuss/aa3539daf7ca412202b4c10d543bc077
 */

import { writable as baseWritable, Writable } from 'svelte/store'

export interface LocalStorageStore<T> extends Writable<T> {
  get: () => T
  reset: () => void
}

export function localStorageStore<T = string>(key: string, defaultValue: T): LocalStorageStore<T> {
  // Initialise writable store with given default value
  const store = baseWritable(defaultValue)

  // Check existing value in localStorage
  const existingValue = localStorage.getItem(key)
  if (existingValue) store.set(JSON.parse(existingValue))
  else localStorage.setItem(key, JSON.stringify(defaultValue))

  return {
    set(value: T) {
      localStorage.setItem(key, JSON.stringify(value))
      store.set(value)
    },
    get(): T {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    },
    reset() {
      this.set(defaultValue)
    },
    update(cb: (v: T) => T) {
      this.set(cb(this.get()))
    },
    subscribe: store.subscribe,
  }
}
