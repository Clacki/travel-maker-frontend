import { PageLayout } from '@/components/layout/PageLayout'

export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return <PageLayout>Profile Edit Page - {userId}</PageLayout>
}
