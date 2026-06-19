'use client'

import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/common/button'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { ProfileDropdown } from '@/components/layout/ProfileDropdown'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { css, cx } from '@/styled-system/css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type MouseEvent, useState } from 'react'
import { isSameInternalHref } from './navigationUtils'

const navigationItems = [
  { href: ROUTES.TEST, label: 'Travel Style', mobileLabel: '취향' },
  { href: ROUTES.EXPLORE, label: 'Explore', mobileLabel: '탐색' },
  { href: ROUTES.TRIPS, label: 'Trips', mobileLabel: '코스' },
] as const

const headerStyle = css({
  bg: 'bg.surface',
  borderBottomWidth: '1px',
  borderBottomColor: 'border.subtle',
  position: 'sticky',
  top: 0,
  zIndex: 50,
})

const headerInnerStyle = css({
  minH: '72px',
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

const desktopNavLabelStyle = css({
  display: { base: 'none', md: 'inline' },
})

const mobileNavLabelStyle = css({
  display: { base: 'inline', md: 'none' },
})

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const pathname = usePathname()
  const origin =
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)
  const isSameHref = (href: string) =>
    isSameInternalHref({
      href,
      origin,
      currentPathname: pathname,
      currentSearchParams: '',
    })
  const preventSameHrefNavigation =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.defaultPrevented) {
        return
      }

      if (
        typeof window !== 'undefined' &&
        isSameInternalHref({
          href,
          origin: window.location.origin,
          currentPathname: window.location.pathname,
          currentSearchParams: window.location.search,
        })
      ) {
        event.preventDefault()
      }
    }

  return (
    <>
      <header className={cx(headerStyle, className)}>
        <LayoutContainer className={headerInnerStyle}>
          <Link
            href={ROUTES.HOME}
            className={logoStyle}
            aria-current={isSameHref(ROUTES.HOME) ? 'page' : undefined}
            onClick={preventSameHrefNavigation(ROUTES.HOME)}
          >
            TravelMaker
          </Link>

          <div className={headerActionsStyle}>
            <nav aria-label="주요 메뉴" className={navStyle}>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkStyle}
                  aria-current={isSameHref(item.href) ? 'page' : undefined}
                  onClickCapture={preventSameHrefNavigation(item.href)}
                  onClick={preventSameHrefNavigation(item.href)}
                >
                  <span className={desktopNavLabelStyle}>{item.label}</span>
                  <span className={mobileNavLabelStyle}>
                    {item.mobileLabel}
                  </span>
                </Link>
              ))}
            </nav>

            {!isAuthInitialized ? (
              <Button
                aria-busy="true"
                disabled
                variant="secondary"
                size="sm"
                shape="pill"
              >
                Login
              </Button>
            ) : isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Button
                onClick={openLoginModal}
                variant="secondary"
                size="sm"
                shape="pill"
              >
                Login
              </Button>
            )}
          </div>
        </LayoutContainer>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  )
}
