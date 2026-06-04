import { css, cx } from '@/styled-system/css'
import NextImage, { type StaticImageData } from 'next/image'
import type { ReactNode } from 'react'

const layoutStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  maxW: '480px',
  mx: 'auto',
  px: { base: '4', md: '6' },
  py: { base: '8', md: '12' },
  textAlign: 'center',
})

const imageStyle = css({
  width: { base: '120px', md: '160px' },
  height: { base: '120px', md: '160px' },
  mb: '6',
  flexShrink: 0,
  objectFit: 'contain',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  mt: '2',
  color: 'text.secondary',
  fontSize: 'md',
  lineHeight: 'normal',
})

const actionStyle = css({
  mt: '6',
  display: 'flex',
  justifyContent: 'center',
})

export interface StatusLayoutProps {
  title: string
  description?: string
  action?: ReactNode
  imageSrc?: StaticImageData
  imageAlt?: string
  className?: string
}

export function StatusLayout({
  title,
  description,
  action,
  imageSrc,
  imageAlt = '',
  className,
}: StatusLayoutProps) {
  return (
    <div className={cx(layoutStyle, className)}>
      {imageSrc && (
        <NextImage alt={imageAlt} className={imageStyle} src={imageSrc} />
      )}

      <h2 className={titleStyle}>{title}</h2>

      {description && <p className={descriptionStyle}>{description}</p>}

      {action && <div className={actionStyle}>{action}</div>}
    </div>
  )
}
