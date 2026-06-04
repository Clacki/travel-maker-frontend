import { PageLayout } from '@/components/layout/PageLayout'

interface ProfileEditPageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { userId } = await params

  return <PageLayout>Profile Edit Page - {userId}</PageLayout>
}
