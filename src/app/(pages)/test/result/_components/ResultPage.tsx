import { isAuthenticated } from '@/lib/auth'

import { ResultClientLayer } from './ResultClientLayer'

export async function ResultPage() {
  const authenticated = await isAuthenticated()
  return <ResultClientLayer isAuthenticated={authenticated} />
}
