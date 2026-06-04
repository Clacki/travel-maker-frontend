import { cva } from '@/styled-system/css'

export type KeywordTagVariant = 'card' | 'result'

export interface KeywordTagProps {
  label: string
  variant?: KeywordTagVariant
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
  },
  defaultVariants: {
    variant: 'result',
  },
})

export function KeywordTag({ label, variant = 'result' }: KeywordTagProps) {
  return <span className={keywordTagStyle({ variant })}>{`#${label}`}</span>
}

export default KeywordTag
