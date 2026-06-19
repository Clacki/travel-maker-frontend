'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User } from 'lucide-react'

import { Modal } from '@/components/common/modal/Modal'
import { ROUTES } from '@/constants/routes'
import { css } from '@/styled-system/css'

import { useFollowList } from '../../hooks/useFollowList'

interface FollowListModalProps {
  isOpen: boolean
  userId: number
  type: 'followers' | 'following'
  onClose: () => void
}

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  height: { base: '240px', md: '320px' },
  overflowY: 'auto',
})

const itemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  px: '1',
  py: '3',
  borderBottomWidth: '1px',
  borderColor: 'border.subtle',
  textDecoration: 'none',
  color: 'text.primary',
  borderRadius: 'sm',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'bg.muted',
  },
  _last: {
    borderBottomWidth: '0',
  },
})

const avatarStyle = css({
  width: '40px',
  height: '40px',
  borderRadius: 'pill',
  bg: 'bg.muted',
  overflow: 'hidden',
  flexShrink: 0,
})

const avatarPlaceholderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  height: 'full',
  color: 'text.secondary',
})

const nicknameStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const emptyStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  py: '10',
  color: 'text.secondary',
  fontSize: 'sm',
})

const loadingDotStyle = css({
  display: 'flex',
  justifyContent: 'center',
  py: '4',
  color: 'text.secondary',
  fontSize: 'sm',
})

export function FollowListModal({
  isOpen,
  userId,
  type,
  onClose,
}: FollowListModalProps) {
  const { users, isLoading, hasNextPage, loadMore } = useFollowList({
    userId,
    type,
    enabled: isOpen,
  })

  const listRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const list = listRef.current
    if (!sentinel || !list) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          loadMore()
        }
      },
      { root: list, threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isLoading, loadMore])

  const title = type === 'followers' ? '팔로워' : '팔로잉'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div ref={listRef} className={listStyle}>
        {!isLoading && users.length === 0 && (
          <p className={emptyStyle}>
            {type === 'followers' ? '팔로워가 없습니다.' : '팔로잉이 없습니다.'}
          </p>
        )}

        {users.map((user) => (
          <Link
            key={user.user_id}
            href={ROUTES.PROFILE(String(user.user_id))}
            className={itemStyle}
            onClick={onClose}
          >
            <div className={avatarStyle}>
              {user.profile_img_url ? (
                <Image
                  src={user.profile_img_url}
                  alt={`${user.nickname} 프로필`}
                  width={40}
                  height={40}
                  className={css({
                    objectFit: 'cover',
                    width: 'full',
                    height: 'full',
                  })}
                />
              ) : (
                <div className={avatarPlaceholderStyle} aria-hidden="true">
                  <User size={20} />
                </div>
              )}
            </div>
            <span className={nicknameStyle}>{user.nickname}</span>
          </Link>
        ))}

        {isLoading && <p className={loadingDotStyle}>불러오는 중...</p>}

        <div ref={sentinelRef} />
      </div>
    </Modal>
  )
}
