import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

const navigationItems = [
  { href: ROUTES.RECOMMENDATION, label: '추천 여행지' },
  { href: ROUTES.TRAVEL, label: '지역별 여행' },
  { href: ROUTES.RESULT, label: '여행 코스' },
  { href: ROUTES.MYPAGE, label: '리뷰' },
] as const

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={ROUTES.HOME} className="text-lg font-bold">
          TRAVELMAKER
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={ROUTES.LOGIN}>로그인</Link>
      </div>
    </header>
  )
}
