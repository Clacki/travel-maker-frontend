import { css } from '@/styled-system/css'

import type { CompassAxis } from '@/features/result/result.types'

interface RadarChartProps {
  axes: CompassAxis[]
  centerImageSrc: string
  centerLabel: string
}

/**
 * SVG fill/stroke 속성은 Panda css() 함수 밖이지만,
 * Panda가 생성하는 CSS custom property(var(--colors-*))는 SVG에서도 동작합니다.
 * → 토큰이 있는 색상은 var() 로 참조해 토큰 변경 시 자동 반영됩니다.
 *
 * 예외 (토큰 없음 — hex 유지):
 *   gradOuter #D6DEF1 — 중앙 원 방사형 그라데이션 바깥색 (디자인팀 지정값)
 *   dataFill  rgba(...) — primary + 18% 불투명도, var()로 표현 불가
 */
const C = {
  primary: 'var(--colors-primary)', // tokens.colors.primary  #2CA6BE
  primarySoft: 'var(--colors-primary-soft)', // tokens.colors.primary.soft #D8F3FA
  gradInner: 'var(--colors-bg-surface)', // tokens.colors.bg.surface #FFFFFF
  gradOuter: '#D6DEF1', // 디자인팀 지정값 — 토큰 없음
  grid: 'var(--colors-border-subtle)', // tokens.colors.border.subtle #DCE5E8
  textSec: 'var(--colors-text-secondary)', // tokens.colors.text.secondary #8A9AA0
  white: 'var(--colors-bg-surface)', // tokens.colors.bg.surface #FFFFFF
  dataFill: 'rgba(44,166,190,0.18)', // primary(#2CA6BE) + opacity — hex 유지
} as const

const S = 580 // viewBox 크기
const CX = S / 2 // 290
const CY = S / 2 // 290
const MAX_R = 175 // 최외곽 육각형 반지름
const LEVELS = 4 // 동심 육각형 단계 수
const CTR_R = 40 // 중앙 원 반지름

const svgStyle = css({
  display: 'block',
  maxWidth: '480px',
  mx: 'auto',
})

// 꼭짓점 각도: 위(N)부터 시계방향 60° 간격
const ANGLES = Array.from(
  { length: 6 },
  (_, i) => ((i * 60 - 90) * Math.PI) / 180
)

const px = (a: number, r: number) => CX + r * Math.cos(a)
const py = (a: number, r: number) => CY + r * Math.sin(a)
const f = (n: number) => n.toFixed(1)

function hexPoints(r: number) {
  return ANGLES.map((a) => `${f(px(a, r))},${f(py(a, r))}`).join(' ')
}

/** 꼭짓점 바깥 라벨 위치 계산
 *  텍스트(12px) + 간격(6px) + 배지(22px) = 40px 그룹을 ly 기준으로 배치
 *  - 상단 꼭짓점(sinA≈-1): 그룹이 ly 위로
 *  - 하단 꼭짓점(sinA≈+1): 그룹이 ly 아래로
 *  - 사이드 꼭짓점(|sinA|≈0.5): 그룹 중앙을 ly에 맞춰 좌우 대칭 보장
 */
function getLabelLayout(i: number) {
  const a = ANGLES[i]
  const cosA = Math.cos(a)
  const sinA = Math.sin(a)
  const OUTER_R = MAX_R + 38

  const lx = px(a, OUTER_R)
  const ly = py(a, OUTER_R)

  let anchor: 'start' | 'middle' | 'end' = 'middle'
  if (cosA > 0.4) anchor = 'start'
  else if (cosA < -0.4) anchor = 'end'

  // 사이드 꼭짓점: 그룹(40px)을 ly 중앙 정렬 → catY baseline = ly-8, badgeTopY = ly-2
  // 상단 꼭짓점: 그룹 전체가 위로
  // 하단 꼭짓점: 그룹 전체가 아래로
  let catY: number
  let badgeTopY: number
  if (Math.abs(sinA) < 0.8) {
    // 사이드 꼭짓점 (경험지향, 소비스타일, 계획성, 사교성)
    catY = ly - 8
    badgeTopY = ly + 6
  } else if (sinA < 0) {
    // 상단 꼭짓점 (활동성)
    catY = ly - 28
    badgeTopY = ly - 14
  } else {
    // 하단 꼭짓점 (공간지향)
    catY = ly + 20
    badgeTopY = ly + 34
  }

  return { lx, ly, anchor, catY, badgeTopY }
}

export function RadarChart({
  axes,
  centerImageSrc,
  centerLabel,
}: RadarChartProps) {
  const dataPoints = axes.map((axis, i) => {
    const r = (axis.value / 100) * MAX_R
    return { x: px(ANGLES[i], r), y: py(ANGLES[i], r) }
  })
  const dataPolyStr = dataPoints.map((p) => `${f(p.x)},${f(p.y)}`).join(' ')

  // 중앙 필 라벨 크기 (한글 1자 ≈ 13px)
  const pillW = centerLabel.length * 12.5 + 22
  const pillH = 26
  const pillX = CX - pillW / 2
  // 원 하단(CY - 6 + CTR_R)에서 10px 간격
  const circleCY = CY - 6
  const pillY = circleCY + CTR_R + 10

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width="100%"
      role="img"
      aria-label="여행 성향 나침반 레이더 차트"
      className={svgStyle}
    >
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.gradOuter} />
          <stop offset="100%" stopColor={C.gradInner} />
        </radialGradient>
        <clipPath id="centerClip">
          <circle cx={CX} cy={circleCY} r={CTR_R - 2} />
        </clipPath>
      </defs>
      {/* ── 동심 육각형 그리드 ── */}
      {Array.from({ length: LEVELS }, (_, lvl) => (
        <polygon
          key={lvl}
          points={hexPoints(MAX_R * ((lvl + 1) / LEVELS))}
          fill="none"
          stroke={C.grid}
          strokeWidth={1.2}
        />
      ))}

      {/* ── 축 선 (중심 → 꼭짓점) ── */}
      {ANGLES.map((a, i) => (
        <line
          key={i}
          x1={f(CX)}
          y1={f(CY)}
          x2={f(px(a, MAX_R))}
          y2={f(py(a, MAX_R))}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}

      {/* ── 데이터 폴리곤 ── */}
      <polygon
        points={dataPolyStr}
        fill={C.dataFill}
        stroke={C.primary}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* ── 데이터 포인트 ── */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={f(p.x)} cy={f(p.y)} r={5.5} fill={C.primary} />
      ))}

      {/* ── 꼭짓점 축 라벨 (카테고리 + 배지) ── */}
      {axes.map((axis, i) => {
        const { lx, anchor, catY, badgeTopY } = getLabelLayout(i)
        const badgeW = axis.badge.length * 13 + 18
        let badgeX = lx - badgeW / 2
        if (anchor === 'start') badgeX = lx
        if (anchor === 'end') badgeX = lx - badgeW

        return (
          <g key={i}>
            {/* 카테고리명 */}
            <text
              x={lx}
              y={catY}
              textAnchor={anchor}
              fontSize={12}
              fill={C.textSec}
              fontWeight="500"
            >
              {axis.subject}
            </text>
            {/* 배지 배경 */}
            <rect
              x={badgeX}
              y={badgeTopY}
              width={badgeW}
              height={22}
              rx={11}
              fill={C.primary}
            />
            {/* 배지 텍스트 */}
            <text
              x={badgeX + badgeW / 2}
              y={badgeTopY + 15}
              textAnchor="middle"
              fontSize={11}
              fill={C.white}
              fontWeight="700"
            >
              {axis.badge}
            </text>
          </g>
        )
      })}

      {/* ── 중앙 원 (방사형 그라데이션) ── */}
      <circle cx={CX} cy={circleCY} r={CTR_R} fill="url(#centerGrad)" />

      {/* ── 중앙 타입 이미지 ── */}
      <image
        href={centerImageSrc}
        x={CX - CTR_R + 4}
        y={circleCY - CTR_R + 4}
        width={CTR_R * 2 - 8}
        height={CTR_R * 2 - 8}
        preserveAspectRatio="xMidYMid meet"
        clipPath="url(#centerClip)"
      />

      {/* ── 타입명 필 라벨 ── */}
      <rect
        x={pillX}
        y={pillY}
        width={pillW}
        height={pillH}
        rx={13}
        fill="url(#centerGrad)"
      />
      <text
        x={CX}
        y={pillY + pillH / 2 + 4.5}
        textAnchor="middle"
        fontSize={11}
        fill={C.primary}
        fontWeight="700"
      >
        {centerLabel}
      </text>
    </svg>
  )
}
