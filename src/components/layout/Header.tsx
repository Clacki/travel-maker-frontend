'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { LoginModal } from '@/components/auth/LoginModal'
import { Button, IconButton } from '@/components/common/button'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { css, cx } from '@/styled-system/css'

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

const profileMenuWrapperStyle = css({
  position: 'relative',
  display: 'inline-flex',
})

const profileButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '10',
  height: '10',
  borderRadius: 'pill',
  overflow: 'hidden',
  bg: 'primary.soft',
  borderWidth: '1px',
  borderColor: 'primary',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  cursor: 'pointer',
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

const avatarImageStyle = css({
  width: 'full',
  height: 'full',
  objectFit: 'cover',
})

const avatarFallbackStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  height: 'full',
})

const profileMenuStyle = css({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  zIndex: 60,
  minW: '160px',
  display: 'grid',
  gap: '1',
  p: '2',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  boxShadow: 'md',
})

const profileMenuItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  width: 'full',
  minH: '9',
  px: '3',
  borderRadius: 'sm',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  textAlign: 'left',
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
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

const profileMenuButtonStyle = css({
  border: 'none',
  bg: 'transparent',
})

const authPlaceholderStyle = css({
  width: { base: '8', sm: '72px' },
  height: '8',
})

const desktopLoginButtonStyle = css({
  display: { base: 'none', sm: 'inline-flex' },
})

const mobileLoginButtonStyle = css({
  display: { base: 'inline-flex', sm: 'none' },
})

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [hasAvatarError, setHasAvatarError] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken)
  const userId = useUserProfileStore((state) => state.id)
  const nickname = useUserProfileStore((state) => state.nickname)
  const profileImageUrl = useUserProfileStore((state) => state.profileImageUrl)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)
  const closeProfileMenu = () => setIsProfileMenuOpen(false)
  const toggleProfileMenu = () => setIsProfileMenuOpen((isOpen) => !isOpen)
  const handleLogout = () => {
    clearAccessToken()
    clearUserProfile()
    closeProfileMenu()
  }

  const profileHref = ROUTES.PROFILE(userId ? String(userId) : 'me')
  const avatarLabel = nickname?.trim().slice(0, 2).toUpperCase() || 'TM'
  const canShowAvatarImage = !!profileImageUrl && !hasAvatarError

  return (
    <>
      <header className={cx(headerStyle, className)}>
        <LayoutContainer className={headerInnerStyle}>
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

            {!isAuthInitialized ? (
              <div aria-hidden="true" className={authPlaceholderStyle} />
            ) : isLoggedIn ? (
              <div className={profileMenuWrapperStyle}>
                <button
                  type="button"
                  aria-label="마이페이지 메뉴"
                  aria-expanded={isProfileMenuOpen}
                  className={profileButtonStyle}
                  onClick={toggleProfileMenu}
                >
                  {canShowAvatarImage ? (
                    <img
                      src={profileImageUrl ?? ''}
                      alt={
                        nickname ? `${nickname} 프로필 이미지` : '프로필 이미지'
                      }
                      className={avatarImageStyle}
                      onError={() => setHasAvatarError(true)}
                    />
                  ) : (
                    <span className={avatarFallbackStyle}>{avatarLabel}</span>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className={profileMenuStyle}>
                    <Link
                      href={profileHref}
                      className={profileMenuItemStyle}
                      onClick={closeProfileMenu}
                    >
                      <User size={16} />
                      마이페이지
                    </Link>
                    <button
                      type="button"
                      className={cx(
                        profileMenuItemStyle,
                        profileMenuButtonStyle
                      )}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  className={desktopLoginButtonStyle}
                  onClick={openLoginModal}
                  variant="secondary"
                  size="sm"
                  shape="pill"
                >
                  로그인
                </Button>
                <IconButton
                  aria-label="로그인"
                  className={mobileLoginButtonStyle}
                  onClick={openLoginModal}
                  size="sm"
                >
                  <LoginIcon />
                </IconButton>
              </>
            )}
          </div>
        </LayoutContainer>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
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
