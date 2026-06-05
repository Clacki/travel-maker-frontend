'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { SubTagFilter as CommonSubTagFilter } from '@/components/filters/sub-tag-filter'
import { SubTagFilter as FeatureSubTagFilter } from '@/features/travel/components/SubTagFilter'
import { FilterSection } from '@/components/filters/filter-section'
import {
  FilterCard,
  type FilterSectionData,
} from '@/components/filters/filter-card'
import { SelectedBar } from '@/components/filters/selected-bar'
import { FilterTag } from '@/components/common/tag'
import type { SubTag } from '@/types/travel.types'

const sampleSubTags: SubTag[] = [
  { id: 'beach', name: '해변', icon: '🏖️' },
  { id: 'mountain', name: '산', icon: '🏔️' },
  { id: 'city', name: '도심', icon: '🏙️' },
  { id: 'forest', name: '숲', icon: '🌲' },
  { id: 'hot-spring', name: '온천', icon: '♨️' },
]

const sampleFilterSections: FilterSectionData[] = [
  {
    id: 'theme',
    icon: '🎨',
    label: '테마',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'healing', label: '힐링', emoji: '🌿' },
      { id: 'activity', label: '액티비티', emoji: '🏄' },
      { id: 'culture', label: '문화', emoji: '🏛️' },
      { id: 'food', label: '맛집', emoji: '🍜' },
    ],
  },
  {
    id: 'season',
    icon: '🌸',
    label: '계절',
    badgeVariant: 'single',
    selectionMode: 'single',
    tags: [
      { id: 'spring', label: '봄', emoji: '🌸' },
      { id: 'summer', label: '여름', emoji: '☀️' },
      { id: 'fall', label: '가을', emoji: '🍂' },
      { id: 'winter', label: '겨울', emoji: '❄️' },
    ],
  },
  {
    id: 'with',
    icon: '👥',
    label: '동행',
    badgeVariant: 'bool',
    selectionMode: 'single',
    tags: [
      { id: 'solo', label: '혼자' },
      { id: 'couple', label: '커플' },
      { id: 'family', label: '가족' },
      { id: 'friends', label: '친구' },
    ],
  },
]

export function FilterPlayground() {
  const [commonSelected, setCommonSelected] = useState<string[]>([])
  const [featureSelected, setFeatureSelected] = useState<string[]>([])
  const [sectionTags, setSectionTags] = useState<string[]>([])

  const selectedBarItems = sectionTags.map((id) => ({
    id,
    label: sampleSubTags.find((t) => t.id === id)?.name ?? id,
  }))

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
          sections={sampleFilterSections}
          resultCount={42}
          onApply={(v) => console.log('apply', v)}
          onReset={() => console.log('reset')}
        />
      </div>

      {/* FilterSection: 접이식 단일 섹션 */}
      <div>
        <Label>FilterSection — 접이식 단일 섹션 (filter-section.tsx)</Label>
        <Desc>
          아코디언 형태의 한 섹션. FilterCard 없이 직접 쓸 때 사용. children으로
          FilterTag 등을 넣는다.
        </Desc>
        <div
          className={css({
            borderWidth: '1px',
            borderColor: 'border.subtle',
            borderRadius: 'lg',
            overflow: 'hidden',
          })}
        >
          <FilterSection icon="🏖️" label="지역" badgeVariant="multi" isLast>
            {['서울', '부산', '제주', '강릉', '전주'].map((name) => (
              <FilterTag
                key={name}
                label={name}
                isSelected={sectionTags.includes(name)}
                onClick={() =>
                  setSectionTags((prev) =>
                    prev.includes(name)
                      ? prev.filter((t) => t !== name)
                      : [...prev, name]
                  )
                }
              />
            ))}
          </FilterSection>
        </div>
      </div>

      {/* SelectedBar: 선택된 태그 칩 목록 */}
      <div>
        <Label>SelectedBar — 선택 태그 표시 바 (selected-bar.tsx)</Label>
        <Desc>
          선택된 항목을 칩으로 나열하고 × 버튼으로 개별 해제. FilterCard
          내부에서 자동으로 쓰이지만 단독으로도 사용 가능.
        </Desc>
        <div
          className={css({
            borderWidth: '1px',
            borderColor: 'border.subtle',
            borderRadius: 'lg',
            overflow: 'hidden',
          })}
        >
          <SelectedBar
            selectedItems={
              selectedBarItems.length > 0
                ? selectedBarItems
                : [
                    { id: 'ex1', label: '🌿 힐링' },
                    { id: 'ex2', label: '☀️ 여름' },
                  ]
            }
            onRemove={() => {}}
          />
        </div>
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
          <Label>SubTagFilter — features/travel 버전 (SubTagFilter.tsx)</Label>
          <Desc>
            travel 피처에 남아 있는 이전 버전. py:&quot;10px&quot;,
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
