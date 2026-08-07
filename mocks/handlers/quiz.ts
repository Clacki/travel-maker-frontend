import { delay, http, HttpResponse } from 'msw'
import { demoQuizResult } from '../data/quizData'

export const quizHandlers = [
  http.post('*/quiz/submit', async () => {
    await delay(250)
    return HttpResponse.json(demoQuizResult)
  }),
  http.get('*/quiz/result/shared', async () => {
    await delay(180)
    return HttpResponse.json(demoQuizResult)
  }),
]
