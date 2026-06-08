import { css } from '@/styled-system/css'
import { LayoutContainer } from './LayoutContainer'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <LayoutContainer className={css({ py: '10' })}>{children}</LayoutContainer>
  )
}
