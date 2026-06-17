import { css } from '@/styled-system/css'

// 코스 에디터 페이지 레이아웃 공통 스타일 (create / edit 공유)
export const pageStyle = css({
  minH: 'calc(100vh - 72px)',
  bg: 'bg.canvas',
})

export const headerStyle = css({
  pt: '6',
  pb: '4',
})

export const badgeDotStyle = css({
  w: '1.5',
  h: '1.5',
  borderRadius: 'pill',
  bg: 'primary',
  flexShrink: 0,
})

export const pageSubtitleStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

export const pageBadgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.5',
  px: '2.5',
  py: '1',
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'medium',
  mb: '3',
})

export const pageTitleStyle = css({
  fontSize: '3xl',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
  mb: '2',
})

export const leftPanelStyle = css({
  flex: '0 0 44%',
  minW: 0,
  pr: '3',
  py: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

export const rightPanelStyle = css({
  flex: '0 0 56%',
  minW: 0,
  pl: '3',
  py: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

export const searchWrapperStyle = css({
  flexShrink: 0,
})

export const bodyStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
})

// 코스 카드 공통 스타일 (CourseSidePanel / SchedulePanel 공유)
export const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: '2xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

export const cardTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
})

export const cardDescStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  mt: '0.5',
})
