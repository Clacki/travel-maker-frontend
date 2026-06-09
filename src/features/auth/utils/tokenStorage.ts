export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'
const AUTH_LOGGED_OUT_STORAGE_KEY = 'authLoggedOut'

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export const setStoredAccessToken = (accessToken: string) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
  localStorage.removeItem(AUTH_LOGGED_OUT_STORAGE_KEY)
}

export const removeStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export const markExplicitLogout = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(AUTH_LOGGED_OUT_STORAGE_KEY, 'true')
}

export const clearExplicitLogout = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(AUTH_LOGGED_OUT_STORAGE_KEY)
}

export const hasExplicitLogout = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(AUTH_LOGGED_OUT_STORAGE_KEY) === 'true'
}
