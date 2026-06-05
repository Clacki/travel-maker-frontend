import { css } from '@/styled-system/css'

interface ProgressBarProps {
  current: number
  total: number
}

const wrapper = css({
  w: 'full',
  maxW: '320px',
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5',
})

const labelRow = css({
  w: 'full',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const labelText = css({
  fontSize: 'xs',
  color: 'text.secondary',
  fontWeight: 'medium',
})

const track = css({
  w: 'full',
  h: '1',
  bg: 'bg.muted',
  borderRadius: 'pill',
  overflow: 'hidden',
})

const fill = css({
  h: 'full',
  bg: 'primary',
  borderRadius: 'pill',
  transitionProperty: 'width',
  transitionDuration: '300ms',
})

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={wrapper}>
      <div className={labelRow}>
        <span className={labelText}>
          질문 {current} / {total}
        </span>
        <span className={labelText}>{percentage}%</span>
      </div>
      <div
        className={track}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`퀴즈 진행률 ${percentage}%`}
      >
        <div className={fill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
