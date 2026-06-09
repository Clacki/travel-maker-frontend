import CourseSidePanel from '@/features/course/CourseSidePanel'
import SchedulePanel from '@/features/course/SchedulePanel'

import { css } from '@/styled-system/css'

const pageStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6',
  p: '6',
  minH: 'screen',
  bg: 'bg.canvas',
})

export default function CourseCreatePage() {
  return (
    <div className={pageStyle}>
      <CourseSidePanel />
      <SchedulePanel />
    </div>
  )
}
