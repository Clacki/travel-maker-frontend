'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { LoginModal } from '@/components/auth/LoginModal'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { css } from '@/styled-system/css'

const heroStyle = css({
  display: 'flex',
  alignItems: { base: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  flexDirection: { base: 'column', md: 'row' },
  gap: '6',
  py: { base: '10', md: '12' },
})

const eyebrowStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: '0',
})

const titleStyle = css({
  mt: '4',
  color: 'text.primary',
  fontSize: { base: '2xl', md: '3xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  mt: '3',
  maxW: '620px',
  color: 'text.secondary',
  fontSize: { base: 'sm', md: 'md' },
})

const ctaStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  minH: '11',
  px: '5',
  border: 'none',
  borderRadius: 'sm',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'sm',
  fontWeight: 'semibold',
  boxShadow: 'md',
  transitionProperty: 'background-color, box-shadow, transform',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.hover',
    transform: 'translateY(-1px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.65,
    transform: 'none',
  },
})

export function TripsHeroBanner() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)

  return (
    <>
      <section className={heroStyle} aria-labelledby="trips-page-title">
        <div>
          <p className={eyebrowStyle}>TRAVEL COURSES</p>
          <h1 id="trips-page-title" className={titleStyle}>
            유저들이 만든 여행 코스
          </h1>
          <p className={descriptionStyle}>
            다른 여행자들이 직접 만든 코스를 둘러보고, 마음에 드는 코스를
            저장해보세요.
          </p>
        </div>

        {isLoggedIn ? (
          <Link href={ROUTES.TRIP_CREATE} className={ctaStyle}>
            <Plus size={16} aria-hidden="true" />
            코스 만들기
          </Link>
        ) : (
          <button
            type="button"
            className={ctaStyle}
            disabled={!isAuthInitialized}
            aria-busy={!isAuthInitialized}
            onClick={() => setIsLoginModalOpen(true)}
          >
            <Plus size={16} aria-hidden="true" />
            코스 만들기
          </button>
        )}
      </section>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
