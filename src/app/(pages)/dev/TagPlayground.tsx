'use client'

import { useState } from 'react'
import { FilterTag, KeywordTag, MypageTag } from '@/components/common/tag'
import { css } from '@/styled-system/css'

const filterLabels = ['전체', '맛집', '관광지', '카페', '숙소']
const keywordLabels = ['여행', '힐링', '맛집투어', '혼행', '가족여행']
const mypageLabels = [
  '맛집',
  '카페',
  '액티비티',
  '자연',
  '문화',
  '쇼핑',
  '힐링',
]

const groupStyle = css({ display: 'grid', gap: '5' })

const groupLabelStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  mb: '3',
})

const tagRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

export function TagPlayground() {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(['전체'])
  )
  const [selectedMypage, setSelectedMypage] = useState<Set<string>>(
    new Set(['맛집', '힐링'])
  )

  const toggleFilter = (label: string) =>
    setSelectedFilters((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })

  return (
    <div className={groupStyle}>
      <div>
        <p className={groupLabelStyle}>FilterTag — 다중 선택</p>
        <div className={tagRowStyle}>
          {filterLabels.map((label) => (
            <FilterTag
              key={label}
              label={label}
              isSelected={selectedFilters.has(label)}
              onClick={() => toggleFilter(label)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelStyle}>
          KeywordTag result — 결과 페이지 표시용
        </p>
        <div className={tagRowStyle}>
          {keywordLabels.map((label) => (
            <KeywordTag key={label} label={label} variant="result" />
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelStyle}>KeywordTag card — 카드 내부 표시용</p>
        <div className={tagRowStyle}>
          {keywordLabels.map((label) => (
            <KeywordTag key={label} label={label} variant="card" />
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelStyle}>MypageTag — 관심 태그 다중 선택</p>
        <div className={tagRowStyle}>
          {mypageLabels.map((label) => (
            <MypageTag
              key={label}
              label={label}
              isSelected={selectedMypage.has(label)}
              onClick={() =>
                setSelectedMypage((prev) => {
                  const next = new Set(prev)
                  next.has(label) ? next.delete(label) : next.add(label)
                  return next
                })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelStyle}>Disabled</p>
        <div className={tagRowStyle}>
          <FilterTag label="비활성" disabled />
          <MypageTag label="비활성" disabled />
        </div>
      </div>
    </div>
  )
}
