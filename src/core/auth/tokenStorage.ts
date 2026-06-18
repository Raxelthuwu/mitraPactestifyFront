const TOKEN_KEY = 'ph_session_token'
let tokenCache: string | null | undefined

export const tokenStorage = {
  get() {
    if (tokenCache !== undefined) return tokenCache
    tokenCache = window.localStorage.getItem(TOKEN_KEY)
    return tokenCache
  },
  set(token: string) {
    tokenCache = token
    window.localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    tokenCache = null
    window.localStorage.removeItem(TOKEN_KEY)
  },
}

window.addEventListener('storage', (event) => {
  if (event.key === TOKEN_KEY) tokenCache = event.newValue
})
