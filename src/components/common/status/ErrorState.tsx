'use client'

import errorStatusImage from '@/assets/images/status/error-status.svg'
import { Button } from '@/components/common/button'
import { StatusLayout } from './StatusLayout'

export interface ErrorStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function ErrorState({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해주세요.',
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <StatusLayout
      title={title}
      description={description}
      imageSrc={errorStatusImage}
      action={
        actionLabel && onAction ? (
          <Button onClick={onAction}>{actionLabel}</Button>
        ) : undefined
      }
      className={className}
    />
  )
}
