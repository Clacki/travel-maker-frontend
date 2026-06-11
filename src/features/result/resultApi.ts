import { mockResultData } from './data/resultDataMock'

import type { TestResultResponse } from './result.types'

// TODO: 백엔드 API 확정 시 실제 API 호출로 교체
// import api from '@/lib/api'
// export const getTestResult = async (): Promise<TestResultResponse> => {
//   const { data } = await api.get<TestResultResponse>('/test/result')
//   return data
// }

export const getTestResult = async (): Promise<TestResultResponse> => {
  return mockResultData
}
