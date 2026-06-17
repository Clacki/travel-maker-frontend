'use client'

import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { css } from '@/styled-system/css'

const ownerBadgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  minH: '8',
  px: '3',
  borderRadius: 'pill',
  bg: 'bg.muted',
  color: 'text.primary',
  fontSize: 'xs',
  fontWeight: 'bold',
})

interface OwnerBadgeProps {
  authorId: number
}

export function OwnerBadge({ authorId }: OwnerBadgeProps) {
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const isOwner = userProfile !== null && Number(userProfile.id) === authorId

  if (!isOwner) return null

  return <span className={ownerBadgeStyle}>내가 만든 코스</span>
}
