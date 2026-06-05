import axios from 'axios'

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      return config
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: /auth/token/refresh/로 Silent Refresh 후 재요청합니다.
      // TODO: Refresh Token 만료 시 auth store 정리와 로그인 유도 처리가 필요합니다.
    }

    return Promise.reject(error)
  }
)

export default api
