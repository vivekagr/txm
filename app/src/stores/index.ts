import { timeoutStore } from './timeout'
import { jwtStore } from './jwt'

export const errors = timeoutStore<string>(5000)
export const authToken = jwtStore()
