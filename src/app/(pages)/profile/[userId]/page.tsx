import { MyPageContent } from '@/features/mypage/components/MyPageContent'

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params

  return <MyPageContent userId={userId} />
}
