export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'
export const AUTH_LOGGED_OUT_STORAGE_KEY = 'authLoggedOut'

export const clearLegacyStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export const markAuthLoggedOut = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(AUTH_LOGGED_OUT_STORAGE_KEY, 'true')
}

export const clearAuthLoggedOut = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(AUTH_LOGGED_OUT_STORAGE_KEY)
}

export const getAuthLoggedOut = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(AUTH_LOGGED_OUT_STORAGE_KEY) === 'true'
}
