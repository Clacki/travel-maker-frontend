'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { css, cx } from '@/styled-system/css'
import { isSameInternalHref } from './navigationUtils'

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
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.7,
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
  bg: 'primary.soft',
  color: 'primary',
  '& svg': {
    width: '20px',
    height: '20px',
  },
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
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
})

const profileMenuButtonStyle = css({
  border: 'none',
  bg: 'transparent',
})

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAvatarError, setHasAvatarError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const origin =
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const { isLoggingOut, logout } = useLogout()

  // TODO: Replace /profile/me with the real current-user id once profile API is connected.
  const profileHref = ROUTES.PROFILE(userProfile?.id ?? 'me')
  const profileImageUrl = userProfile?.profileImageUrl ?? null
  const nickname = userProfile?.nickname ?? null
  const canShowAvatarImage = !!profileImageUrl && !hasAvatarError

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((current) => !current)

  const handleLogoutClick = async () => {
    await logout()
    closeMenu()
  }

  const isCurrentProfileHref = isSameInternalHref({
    href: profileHref,
    origin,
    currentPathname: pathname,
    currentSearchParams: '',
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={profileMenuWrapperStyle} ref={dropdownRef}>
      <button
        type="button"
        aria-label="사용자 메뉴 열기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={profileButtonStyle}
        disabled={isLoggingOut}
        onClick={toggleMenu}
      >
        {canShowAvatarImage ? (
          <img
            src={profileImageUrl ?? ''}
            alt={nickname ? `${nickname} 프로필 이미지` : '프로필 이미지'}
            className={avatarImageStyle}
            onError={() => setHasAvatarError(true)}
          />
        ) : (
          <span className={avatarFallbackStyle} aria-hidden="true">
            <User />
          </span>
        )}
      </button>

      {isOpen && (
        <div className={profileMenuStyle} role="menu">
          <Link
            href={profileHref}
            className={profileMenuItemStyle}
            role="menuitem"
            aria-current={isCurrentProfileHref ? 'page' : undefined}
            onClick={(event) => {
              if (
                typeof window !== 'undefined' &&
                isSameInternalHref({
                  href: profileHref,
                  origin: window.location.origin,
                  currentPathname: window.location.pathname,
                  currentSearchParams: window.location.search,
                })
              ) {
                event.preventDefault()
              }

              closeMenu()
            }}
          >
            <User size={16} />
            마이페이지
          </Link>
          <button
            type="button"
            className={cx(profileMenuItemStyle, profileMenuButtonStyle)}
            disabled={isLoggingOut}
            role="menuitem"
            onClick={handleLogoutClick}
          >
            <LogOut size={16} />
            {isLoggingOut ? '로그아웃 중' : '로그아웃'}
          </button>
        </div>
      )}
    </div>
  )
}
