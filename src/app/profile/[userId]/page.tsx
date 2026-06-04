import { PageLayout } from '@/components/layout/PageLayout'

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params

  return <PageLayout>Profile Page - {userId}</PageLayout>
}
