import { css } from '@/styled-system/css'
import type { ReactNode } from 'react'

const style = css({ animation: 'blurIn 0.6s ease-out' })

export function PageFadeIn({ children }: { children: ReactNode }) {
  return <div className={style}>{children}</div>
}
