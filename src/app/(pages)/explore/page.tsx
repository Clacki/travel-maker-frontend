import { isAuthenticated } from '@/lib/auth'
import ExplorePage from '@/features/explore/ExplorePage'

export default async function ExplorePageWrapper() {
  const authenticated = await isAuthenticated()
  return <ExplorePage isAuthenticated={authenticated} />
}
