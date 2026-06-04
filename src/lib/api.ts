import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // TODO: auth Zustand 스토어에서 access token 읽어 Authorization 헤더 부착
    // Access Token은 메모리(Zustand)에 저장, Refresh Token은 HttpOnly Cookie로 관리
    // 401 응답 시 /api/v1/auth/token/refresh로 Silent Refresh 필요
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: /api/v1/auth/token/refresh로 Silent Refresh 후 재요청
      // TODO: Refresh Token 만료 시 auth Zustand 스토어 초기화 및 로그인 페이지 이동
    }
    return Promise.reject(error)
  }
)

export default api
