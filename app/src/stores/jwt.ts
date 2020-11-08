/**
 * Auth token store.
 */

import { localStorageStore, LocalStorageStore } from './localStorage'

export interface JWTStore extends LocalStorageStore {
  isValid: () => boolean
}

// jwt store wrapping local storage store with method for checking
// validity of the token based on the expiry value on it
export function jwtStore(): JWTStore {
  const store = localStorageStore('authJwt')

  return {
    ...store,
    isValid() {
      try {
        const token = this.get()
        if (!token) return false

        const { exp } = JSON.parse(atob(token.split('.')[1]))
        if (exp < Date.now() / 1000) {
          // Reset store before returning false
          this.reset()
          return false
        }
        return true
      } catch (e) {
        return false
      }
    },
  }
}
