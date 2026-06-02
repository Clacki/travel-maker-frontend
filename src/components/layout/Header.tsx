import Link from 'next/link'
import { LoginButton } from '@/components/layout/LoginButton'
import { ROUTES } from '@/constants/routes'

const navigationItems = [
  { href: ROUTES.EXPLORE, label: '탐색' },
  { href: ROUTES.TEST, label: '성향 테스트' },
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
        <LoginButton />
      </div>
    </header>
  )
}
