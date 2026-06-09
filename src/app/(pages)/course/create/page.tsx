import CourseSidePanel from '@/features/course/CourseSidePanel'

import { css } from '@/styled-system/css'

const layoutStyle = css({
  display: 'flex',
  gap: '6',
  p: '6',
  minH: 'screen',
  bg: 'bg.canvas',
})

const asideStyle = css({
  w: '400px',
  flexShrink: 0,
})

const mainStyle = css({
  flex: 1,
  bg: 'bg.muted',
  borderRadius: 'lg',
  minH: '600px',
})

export default function CourseCreatePage() {
  return (
    <div className={layoutStyle}>
      <aside className={asideStyle}>
        <CourseSidePanel />
      </aside>
      <main className={mainStyle}>{/* TODO: 지도 컴포넌트 */}</main>
    </div>
  )
}
