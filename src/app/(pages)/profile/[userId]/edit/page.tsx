import { ProfileEditContent } from '@/features/mypage/components/ProfileEditContent'

interface ProfileEditPageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { userId } = await params

  return <ProfileEditContent userId={userId} />
}
