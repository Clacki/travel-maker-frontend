import { delay, http, HttpResponse } from 'msw'
import { DEMO_ACCESS_TOKEN, demoDb, setDemoSession } from '../db'

const isAuthorized = (request: Request) =>
  request.headers.get('authorization') === `Bearer ${DEMO_ACCESS_TOKEN}`

export const authHandlers = [
  http.post('*/auth/demo-login', async () => {
    await delay(350)
    setDemoSession(true)
    return HttpResponse.json({ access_token: DEMO_ACCESS_TOKEN })
  }),
  http.get('*/users', async ({ request }) => {
    await delay(180)
    if (!isAuthorized(request)) {
      return HttpResponse.json(
        { detail: 'Authentication required.' },
        { status: 401 }
      )
    }
    return HttpResponse.json({ ...demoDb.user })
  }),
  http.get('*/users/:userId', async ({ params }) => {
    await delay(180)
    const user = demoDb.users[Number(params.userId)]
    if (!user) {
      return HttpResponse.json({ detail: 'User not found.' }, { status: 404 })
    }
    // The public profile endpoint intentionally omits private/account-only fields.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email: _email, bookmark_count: _bookmarkCount, ...profile } = user
    return HttpResponse.json({
      ...profile,
      travel_type_name:
        Number(params.userId) % 2 === 0 ? '감성 탐험가' : '도시 산책가',
      is_following: Number(params.userId) === 2,
    })
  }),
]
