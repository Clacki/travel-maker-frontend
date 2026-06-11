import Image from 'next/image'
import Link from 'next/link'
import { Pencil, User } from 'lucide-react'
import { css } from '@/styled-system/css'
import type { UserProfile } from '@/types/mypage.types'

interface ProfileCardProps {
  user: UserProfile
  isMyProfile: boolean
  onEditClick?: () => void
  onWithdrawClick?: () => void
}

const cardStyle = css({
  display: 'flex',
  gap: '6',
  p: '6',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
  position: 'relative',
})

const avatarStyle = css({
  width: '80px',
  height: '80px',
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
  bg: 'bg.muted',
  color: 'text.secondary',
})

const infoStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  flex: '1',
})

const nameRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
})

const nicknameStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '2',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'semibold',
  textDecoration: 'none',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.hover',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const bioStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
})

const statsRowStyle = css({
  display: 'flex',
  gap: '4',
})

const statItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const statValueStyle = css({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'text.primary',
})

const statLabelStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const tagRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '3',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'medium',
})

const editButtonStyle = css({
  position: 'absolute',
  top: '6',
  right: '6',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '3',
  py: '2',
  borderRadius: 'sm',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  bg: 'bg.surface',
  color: 'text.secondary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'bg.muted',
    borderColor: 'border',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const withdrawButtonStyle = css({
  position: 'absolute',
  bottom: '6',
  right: '6',
  display: 'inline-flex',
  alignItems: 'center',
  px: '3',
  py: '2',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'semibold',
  border: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.hover',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

export function ProfileCard({
  user,
  isMyProfile,
  onEditClick,
  onWithdrawClick,
}: ProfileCardProps) {
  return (
    <div className={cardStyle}>
      <div className={avatarStyle}>
        {user.profile_img_url ? (
          <Image
            src={user.profile_img_url}
            alt={`${user.nickname} 프로필 이미지`}
            width={80}
            height={80}
            className={css({
              objectFit: 'cover',
              width: 'full',
              height: 'full',
            })}
          />
        ) : (
          <div className={avatarPlaceholderStyle} aria-hidden="true">
            <User size={32} />
          </div>
        )}
      </div>

      <div className={infoStyle}>
        <div className={nameRowStyle}>
          <span className={nicknameStyle}>{user.nickname}</span>
          {isMyProfile && (
            <Link href="/test" className={badgeStyle}>
              성향테스트 하기
            </Link>
          )}
        </div>

        {user.bio && <p className={bioStyle}>{user.bio}</p>}

        <div className={statsRowStyle}>
          <div className={statItemStyle}>
            <span className={statValueStyle}>{user.follower_count}</span>
            <span className={statLabelStyle}>팔로워</span>
          </div>
          <div className={statItemStyle}>
            <span className={statValueStyle}>{user.following_count}</span>
            <span className={statLabelStyle}>팔로잉</span>
          </div>
        </div>

        {user.tags.length > 0 && (
          <div className={tagRowStyle}>
            {user.tags.map((tag) => (
              <span key={tag.id} className={tagStyle}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {isMyProfile && onEditClick && (
        <button type="button" className={editButtonStyle} onClick={onEditClick}>
          <Pencil size={14} />
          프로필 수정
        </button>
      )}

      {isMyProfile && onWithdrawClick && (
        <button
          type="button"
          className={withdrawButtonStyle}
          onClick={onWithdrawClick}
        >
          회원탈퇴
        </button>
      )}
    </div>
  )
}
