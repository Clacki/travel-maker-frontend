import { AuthGate } from '@/components/auth/AuthGate'
import { ProfileEditContent } from '@/features/mypage/components/ProfileEditContent'

interface ProfileEditPageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { userId } = await params

  return (
    <AuthGate>
      <ProfileEditContent userId={userId} />
    </AuthGate>
  )
}
