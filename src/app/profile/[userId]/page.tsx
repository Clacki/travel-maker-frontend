import { PageLayout } from '@/components/layout/PageLayout'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return <PageLayout>Profile Page - {userId}</PageLayout>
}
