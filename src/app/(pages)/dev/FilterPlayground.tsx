'use client'

import { useState } from 'react'
import { SubTagFilter as CommonSubTagFilter } from '@/components/filters/sub-tag-filter'
import { SubTagFilter as FeatureSubTagFilter } from '@/features/explore/components/SubTagFilter'
import { FilterCard } from '@/components/filters/filter-card'
import { travelFilterSections } from '@/lib/filter-data'
import type { SubTag } from '@/types/travel.types'
import { css } from '@/styled-system/css'

const sampleSubTags: SubTag[] = [
  { id: 'beach', name: '해변', icon: '🏖️' },
  { id: 'mountain', name: '산', icon: '🏔️' },
  { id: 'city', name: '도심', icon: '🏙️' },
  { id: 'forest', name: '숲', icon: '🌲' },
  { id: 'hot-spring', name: '온천', icon: '♨️' },
]

export function FilterPlayground() {
  const [commonSelected, setCommonSelected] = useState<string[]>([])
  const [featureSelected, setFeatureSelected] = useState<string[]>([])

  return (
    <div className={css({ display: 'grid', gap: '8' })}>
      {/* FilterCard: 탭형 전체 필터 카드 */}
      <div>
        <Label>FilterCard — 탭형 필터 (filter-card.tsx)</Label>
        <Desc>
          sections 배열을 받아 탭·드롭다운·선택바·초기화/적용 버튼을 한 번에
          제공하는 완성형 컴포넌트
        </Desc>
        <FilterCard
          sections={travelFilterSections}
          resultCount={42}
          onApply={() => {}}
          onReset={() => {}}
        />
      </div>

      {/* SubTagFilter 두 버전 비교 */}
      <div className={css({ display: 'grid', gap: '5' })}>
        <div>
          <Label>
            SubTagFilter — components/filters 버전 (sub-tag-filter.tsx)
          </Label>
          <Desc>
            컨벤션 정비된 공통 버전. type=&quot;button&quot;, _focusVisible,
            디자인 토큰 표기 통일.
          </Desc>
          <CommonSubTagFilter
            subTags={sampleSubTags}
            selectedTags={commonSelected}
            onTagToggle={(id) =>
              setCommonSelected((prev) =>
                prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
              )
            }
          />
        </div>

        <div>
          <Label>SubTagFilter — features/explore 버전 (SubTagFilter.tsx)</Label>
          <Desc>
            explore 피처에 남아 있는 이전 버전. py:&quot;10px&quot;,
            rounded:&quot;full&quot; 등 비토큰 값 사용, type=&quot;button&quot;
            누락.
          </Desc>
          <FeatureSubTagFilter
            subTags={sampleSubTags}
            selectedTags={featureSelected}
            onTagToggle={(id) =>
              setFeatureSelected((prev) =>
                prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={css({
        fontSize: 'sm',
        fontWeight: 'bold',
        color: 'text.primary',
        mb: '1',
        fontFamily: 'mono',
      })}
    >
      {children}
    </p>
  )
}

function Desc({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={css({
        fontSize: 'xs',
        color: 'text.secondary',
        mb: '3',
      })}
    >
      {children}
    </p>
  )
}
