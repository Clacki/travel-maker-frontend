'use client'

import type { CompassAxis } from '@/features/result/result.types'

interface RadarChartProps {
  axes: CompassAxis[]
  centerEmoji: string
  centerLabel: string
}

/**
 * SVG 직접 색상값 사용 — Panda CSS 토큰이 SVG 속성에 미지원
 * design-system.md 기준값 사용
 * primary: #2CA6BE / primary.soft: #D8F3FA
 * text.secondary: #8A9AA0 / border.subtle: #C8DCE2
 */
const C = {
  primary: '#2CA6BE',
  primarySoft: '#D8F3FA',
  gradInner: '#FFFFFF',
  gradOuter: '#D6DEF1',
  grid: '#C8DCE2',
  textSec: '#8A9AA0',
  white: '#FFFFFF',
  dataFill: 'rgba(44,166,190,0.18)',
} as const

const S = 580 // viewBox 크기
const CX = S / 2 // 290
const CY = S / 2 // 290
const MAX_R = 175 // 최외곽 육각형 반지름
const LEVELS = 4 // 동심 육각형 단계 수
const CTR_R = 40 // 중앙 원 반지름

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

/** 꼭짓점 바깥 라벨 위치 계산 */
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

  // 위쪽 꼭짓점(sinA < 0): 카테고리→배지 위→아래 순
  // 아래쪽 꼭짓점(sinA > 0): 카테고리→배지 위→아래 순 (라벨이 아래로 뻗음)
  const catY = sinA <= 0 ? ly - 16 : ly + 14
  const badgeTopY = sinA <= 0 ? ly + 0 : ly + 28

  return { lx, ly, anchor, catY, badgeTopY }
}

export function RadarChart({
  axes,
  centerEmoji,
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
      style={{ display: 'block', maxWidth: '480px', margin: '0 auto' }}
    >
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.gradOuter} />
          <stop offset="100%" stopColor={C.gradInner} />
        </radialGradient>
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

      {/* ── 중앙 이모지 ── */}
      <text
        x={CX}
        y={circleCY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={32}
      >
        {centerEmoji}
      </text>

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
