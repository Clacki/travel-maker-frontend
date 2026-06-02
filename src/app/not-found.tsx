import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <div>
      <h1>페이지를 찾을 수 없어요</h1>
      <p>주소를 다시 확인해주세요.</p>
      <Link href={ROUTES.HOME}>홈으로 돌아가기</Link>
    </div>
  )
}
