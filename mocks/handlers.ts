import type { RequestHandler } from 'msw'
import { authHandlers } from './handlers/auth'
import { bookmarkHandlers } from './handlers/bookmarks'
import { placeHandlers } from './handlers/places'
import { reviewHandlers } from './handlers/reviews'
import { profileHandlers } from './handlers/profile'
import { quizHandlers } from './handlers/quiz'
import { routeHandlers } from './handlers/routes'

export const handlers: RequestHandler[] = [
  // Register concrete /users/* routes before the generic /users/:userId route.
  ...profileHandlers,
  ...bookmarkHandlers,
  ...authHandlers,
  ...reviewHandlers,
  ...quizHandlers,
  ...routeHandlers,
  ...placeHandlers,
]
