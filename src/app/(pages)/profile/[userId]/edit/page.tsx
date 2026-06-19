import { AuthGate } from '@/components/auth/AuthGate'
import { ProfileEditContent } from '@/features/mypage/components/ProfileEditContent'
import { ProfileEditRouteGuard } from '@/features/mypage/components/ProfileEditRouteGuard'

interface ProfileEditPageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { userId } = await params

  return (
    <AuthGate>
      <ProfileEditRouteGuard routeUserId={userId}>
        <ProfileEditContent />
      </ProfileEditRouteGuard>
    </AuthGate>
  )
}
