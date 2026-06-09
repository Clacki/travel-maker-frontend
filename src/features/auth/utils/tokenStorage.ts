export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

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
}

export const removeStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}
