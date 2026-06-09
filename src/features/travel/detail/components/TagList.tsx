import { KeywordTag } from '@/components/common/tag/KeywordTag'
import { css } from '@/styled-system/css'
import type { Tag } from '../types/travelDetail.types'

interface TagListProps {
  tags: Tag[]
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
        <KeywordTag key={tag.id} label={tag.tag_name} variant="result" />
      ))}
    </div>
  )
}
