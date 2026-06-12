import { cva, cx } from '@/styled-system/css'

type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'

interface SkeletonProps {
  width?: string
  height?: string
  radius?: RadiusToken
  className?: string
}

const skeletonStyle = cva({
  base: {
    bg: 'bg.subtle',
    animation: 'pulse',
    flexShrink: 0,
  },
  variants: {
    radius: {
      xs: { borderRadius: 'xs' },
      sm: { borderRadius: 'sm' },
      md: { borderRadius: 'md' },
      lg: { borderRadius: 'lg' },
      xl: { borderRadius: 'xl' },
      pill: { borderRadius: 'pill' },
    },
  },
  defaultVariants: {
    radius: 'md',
  },
})

export function Skeleton({
  width,
  height,
  radius = 'md',
  className,
}: SkeletonProps) {
  return (
    <div
      className={cx(skeletonStyle({ radius }), className)}
      style={{ width, height }}
    />
  )
}
