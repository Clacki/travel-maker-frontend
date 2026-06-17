import { cva } from '@/styled-system/css'

export type KeywordTagVariant = 'card' | 'result'

export interface KeywordTagProps {
  label: string
  variant?: KeywordTagVariant
  highlighted?: boolean
}

const keywordTagStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'pill',
    fontSize: 'xs',
    fontWeight: 'medium',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  },
  variants: {
    variant: {
      card: {
        px: '2',
        bg: 'primary',
        color: 'text.inverse',
      },
      result: {
        minH: '7',
        px: '3',
        bg: 'primary.soft',
        color: 'primary',
      },
    },
    highlighted: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'result',
      highlighted: true,
      css: {
        fontWeight: 'semibold',
        backgroundImage:
          'linear-gradient(90deg, #A8DCF0 0%, #A8DCF0 30%, rgba(255,255,255,0.85) 50%, #A8DCF0 70%, #A8DCF0 100%)',
        backgroundSize: '300% 100%',
        animation: 'tagShimmer 2.5s linear infinite',
      },
    },
  ],
  defaultVariants: {
    variant: 'result',
    highlighted: false,
  },
})

export function KeywordTag({
  label,
  variant = 'result',
  highlighted = false,
}: KeywordTagProps) {
  return (
    <span className={keywordTagStyle({ variant, highlighted })}>
      {`#${label}`}
    </span>
  )
}

export default KeywordTag
