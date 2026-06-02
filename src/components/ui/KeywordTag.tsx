import { css } from '@/styled-system/css'

export interface KeywordTagProps {
  label: string
}

const keywordTagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '7',
  px: '3',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'medium',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
  bg: 'primary.soft',
  color: 'primary',
})

export function KeywordTag({ label }: KeywordTagProps) {
  return <span className={keywordTagStyle}>{`#${label}`}</span>
}

export default KeywordTag
