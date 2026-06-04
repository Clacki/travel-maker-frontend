import { Button, IconButton } from '@/components/common/button'
import { ROUTES } from '@/constants/routes'
import { css, cx } from '@/styled-system/css'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

const navigationItems = [
  { href: ROUTES.TEST, label: 'Travel Style' },
  { href: ROUTES.EXPLORE, label: 'Explore' },
] as const

const headerStyle = css({
  bg: 'bg.surface',
  borderBottomWidth: '1px',
  borderBottomColor: 'border.subtle',
  position: 'sticky',
  top: 0,
  zIndex: 10,
})

const headerInnerStyle = css({
  width: '100%',
  maxW: '1120px',
  minH: '72px',
  mx: 'auto',
  px: { base: '4', md: '6' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4',
})

const logoStyle = css({
  color: 'primary',
  fontSize: { base: 'lg', md: 'xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
  letterSpacing: '0',
  whiteSpace: 'nowrap',
  borderRadius: 'sm',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const headerActionsStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: { base: '2', md: '4' },
  minW: 0,
})

const navStyle = css({
  display: { base: 'flex' },
  alignItems: 'center',
  gap: '1',
})

const navLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minH: '10',
  px: '3',
  borderRadius: 'pill',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'background-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.soft',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const profileLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '10',
  height: '10',
  borderRadius: 'pill',
  bg: 'primary.soft',
  borderWidth: '1px',
  borderColor: 'primary',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  transitionProperty: 'border-color, box-shadow, transform',
  transitionDuration: '150ms',
  _hover: {
    boxShadow: 'focus',
    transform: 'translateY(-1px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const desktopLoginButtonStyle = css({
  display: { base: 'none', sm: 'inline-flex' },
})

const mobileLoginButtonStyle = css({
  display: { base: 'inline-flex', sm: 'none' },
})

type HeaderProps = {
  isAuthenticated?: boolean
  className?: string
}

export function Header({ isAuthenticated = false, className }: HeaderProps) {
  return (
    <header className={cx(headerStyle, className)}>
      <div className={headerInnerStyle}>
        <Link href={ROUTES.HOME} className={logoStyle}>
          TravelMaker
        </Link>

        <div className={headerActionsStyle}>
          <nav aria-label="주요 메뉴" className={navStyle}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkStyle}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              href={ROUTES.PROFILE('me')}
              aria-label="마이페이지로 이동"
              className={profileLinkStyle}
            >
              TM
            </Link>
          ) : (
            <>
              <Button
                className={desktopLoginButtonStyle}
                variant="secondary"
                size="sm"
                shape="pill"
              >
                Login
              </Button>
              <IconButton
                aria-label="로그인"
                className={mobileLoginButtonStyle}
                size="sm"
              >
                <LoginIcon />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function LoginIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
