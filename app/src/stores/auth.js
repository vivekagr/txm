/**
 * Auth token store.
 */

import localStorageWritable from './localStorage'

// jwt store wrapping local storage store with method for checking
// validity of the token based on the expiry value on it
function jwtStore() {
  const store = localStorageWritable('authJwt')

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

const authToken = jwtStore()
export default authToken
