'use client'

import emptyStatusImage from '@/assets/images/status/empty-status.svg'
import { Button } from '@/components/common/button'
import { StatusLayout } from './StatusLayout'

export type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title = '표시할 데이터가 없어요',
  description = '조건을 변경하거나 다시 확인해주세요.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <StatusLayout
      title={title}
      description={description}
      imageSrc={emptyStatusImage}
      action={
        actionLabel && onAction ? (
          <Button onClick={onAction}>{actionLabel}</Button>
        ) : undefined
      }
      className={className}
    />
  )
}
