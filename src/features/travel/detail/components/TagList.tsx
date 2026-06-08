import { KeywordTag } from '@/components/common/tag/KeywordTag'
import { css } from '@/styled-system/css'

interface TagListProps {
  tags: string[]
}

const tagListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

export default function TagList({ tags }: TagListProps) {
  return (
    <div className={tagListStyle}>
      {tags.map((tag) => (
        <KeywordTag key={tag} label={tag} variant="result" />
      ))}
    </div>
  )
}
