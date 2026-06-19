import Image from 'next/image'
import { Pencil, User, UserX } from 'lucide-react'
import { css, cx } from '@/styled-system/css'
import type { UserProfile } from '@/types/mypage.types'

interface ProfileCardProps {
  user: UserProfile
  isMyProfile: boolean
  canEdit?: boolean
  canManageAccount?: boolean
  isFollowing?: boolean
  isFollowLoading?: boolean
  onEditClick?: () => void
  onWithdrawClick?: () => void
  onFollowToggle?: () => void
  onFollowerClick?: () => void
  onFollowingClick?: () => void
}

const cardStyle = css({
  display: 'flex',
  flexWrap: { base: 'wrap', md: 'nowrap' },
  gap: { base: '3', md: '6' },
  p: { base: '4', md: '6' },
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
  position: 'relative',
})

const avatarStyle = css({
  width: { base: '64px', md: '80px' },
  height: { base: '64px', md: '80px' },
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
  minW: '0',
  pr: { md: '200px' },
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

const bioStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
})

const statsRowStyle = css({
  display: 'flex',
  gap: '4',
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

const profileActionGroupStyle = css({
  position: { base: 'static', md: 'absolute' },
  top: { md: '6' },
  right: { md: '6' },
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '2',
  flexBasis: { base: '100%', md: 'auto' },
  width: { base: 'full', md: 'auto' },
})

const profileActionButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1',
  minH: '8',
  px: '3',
  borderRadius: 'sm',
  borderWidth: '1px',
  fontSize: 'xs',
  fontWeight: 'semibold',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, color',
  transitionDuration: '150ms',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const editButtonStyle = css({
  borderColor: 'border.subtle',
  bg: 'bg.surface',
  color: 'text.secondary',
  _hover: {
    bg: 'bg.muted',
    borderColor: 'border',
  },
})

const followButtonStyle = css({
  position: 'absolute',
  top: '6',
  right: '6',
  display: 'inline-flex',
  alignItems: 'center',
  px: '4',
  py: '2',
  borderRadius: 'pill',
  fontSize: 'sm',
  fontWeight: 'semibold',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, color',
  transitionDuration: '150ms',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const followingButtonStyle = css({
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.surface',
  color: 'text.secondary',
  _hover: {
    bg: 'bg.muted',
  },
})

const notFollowingButtonStyle = css({
  border: 'none',
  bg: 'primary',
  color: 'text.inverse',
  _hover: {
    bg: 'primary.hover',
  },
})

const withdrawButtonStyle = css({
  borderColor: 'danger.border',
  bg: 'danger.soft',
  color: 'danger',
  _hover: {
    bg: 'danger.border',
    borderColor: 'danger.hover',
    color: 'danger.hover',
  },
})

const statButtonStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  px: '1',
  py: '0',
  borderRadius: 'sm',
  _hover: {
    opacity: 0.7,
  },
})

export function ProfileCard({
  user,
  isMyProfile,
  canEdit = isMyProfile,
  canManageAccount = isMyProfile,
  isFollowing = false,
  isFollowLoading = false,
  onEditClick,
  onWithdrawClick,
  onFollowToggle,
  onFollowerClick,
  onFollowingClick,
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
        </div>

        {user.bio && <p className={bioStyle}>{user.bio}</p>}

        <div className={statsRowStyle}>
          <button
            type="button"
            className={statButtonStyle}
            onClick={onFollowerClick}
          >
            <span className={statValueStyle}>{user.follower_count}</span>
            <span className={statLabelStyle}>팔로워</span>
          </button>
          <button
            type="button"
            className={statButtonStyle}
            onClick={onFollowingClick}
          >
            <span className={statValueStyle}>{user.following_count}</span>
            <span className={statLabelStyle}>팔로잉</span>
          </button>
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

      {((canEdit && onEditClick) || (canManageAccount && onWithdrawClick)) && (
        <div className={profileActionGroupStyle}>
          {canEdit && onEditClick && (
            <button
              type="button"
              className={cx(profileActionButtonStyle, editButtonStyle)}
              onClick={onEditClick}
            >
              <Pencil size={14} aria-hidden="true" />
              프로필 수정
            </button>
          )}
          {canManageAccount && onWithdrawClick && (
            <button
              type="button"
              className={cx(profileActionButtonStyle, withdrawButtonStyle)}
              onClick={onWithdrawClick}
            >
              <UserX size={14} aria-hidden="true" />
              회원탈퇴
            </button>
          )}
        </div>
      )}

      {!isMyProfile && onFollowToggle && (
        <button
          type="button"
          className={`${followButtonStyle} ${isFollowing ? followingButtonStyle : notFollowingButtonStyle}`}
          onClick={onFollowToggle}
          disabled={isFollowLoading}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
      )}
    </div>
  )
}
