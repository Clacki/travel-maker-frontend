import loadingStatusImage from '@/assets/images/status/loading-status.svg'
import { css } from '@/styled-system/css'
import { StatusLayout } from './StatusLayout'

const spinnerStyle = css({
  width: '6',
  height: '6',
  borderRadius: 'pill',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'primary.soft',
  borderTopColor: 'primary',
  animation: 'spin 700ms linear infinite',
})

export interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingState({
  title = '불러오는 중이에요',
  description = '잠시만 기다려주세요.',
  className,
}: LoadingStateProps) {
  return (
    <StatusLayout
      title={title}
      description={description}
      imageSrc={loadingStatusImage}
      action={
        <span aria-label="로딩 중" className={spinnerStyle} role="status" />
      }
      className={className}
    />
  )
}
