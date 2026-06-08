import { css } from '@/styled-system/css'

interface SectionHeaderProps {
  label: string
  heading: string
  subheading?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  label,
  heading,
  subheading,
  align = 'left',
}: SectionHeaderProps) {
  const headerStyle = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
    alignItems: align === 'center' ? 'center' : 'flex-start',
    textAlign: align === 'center' ? 'center' : 'left',
  })

  const labelStyle = css({
    fontSize: 'sm',
    fontWeight: 'semibold',
    color: 'primary',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  })

  const headingStyle = css({
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'text.primary',
  })

  const subheadingStyle = css({
    fontSize: 'md',
    color: 'text.secondary',
    lineHeight: 'normal',
  })

  return (
    <div className={headerStyle}>
      <span className={labelStyle}>{label}</span>
      <h2 className={headingStyle}>{heading}</h2>
      {subheading && <p className={subheadingStyle}>{subheading}</p>}
    </div>
  )
}
