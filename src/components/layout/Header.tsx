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
  gap: { base: '2', md: '4' },
})

const logoStyle = css({
  color: 'primary',
  fontSize: { base: 'lg', md: 'xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
  letterSpacing: '0',
  whiteSpace: 'nowrap',
  flexShrink: 0,
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
  flex: '1',
  minW: 0,
})

const authActionSlotStyle = css({
  width: { base: '10', md: '16' },
  minH: '10',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
})

const unauthenticatedActionSlotStyle = css({
  width: { base: 'auto', md: '16' },
})

const navStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '1',
  flex: '1',
  minW: 0,
})

const navLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minH: '10',
  px: { base: '1', md: '3' },
  flexShrink: 0,
  borderRadius: 'pill',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  whiteSpace: 'nowrap',
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
  const authStatus = useAuthStore((state) => state.authStatus)

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

            <div
              className={cx(
                authActionSlotStyle,
                authStatus === 'unauthenticated' &&
                  unauthenticatedActionSlotStyle
              )}
            >
              {authStatus === 'authenticated' ? (
                <ProfileDropdown />
              ) : authStatus === 'unauthenticated' ? (
                <Button
                  onClick={openLoginModal}
                  variant="secondary"
                  size="sm"
                  shape="pill"
                >
                  Login
                </Button>
              ) : null}
            </div>
          </div>
        </LayoutContainer>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  )
}
