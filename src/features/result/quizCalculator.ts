import type { QuizAnswer } from '@/features/test/quiz.types'

import { COMPASS_AXES_CONFIG } from './result.constants'
import type { CompassAxis } from './result.types'

/**
 * 12문항 A/B 선택에 따른 6축 가중치 테이블
 * 축 인덱스 순서: [활동성, 계획성, 사교성, 공간지향, 경험지향, 소비스타일]
 */
const WEIGHT_TABLE: Record<number, { A: number[]; B: number[] }> = {
  1: { A: [0, 0, 1, 1, 0, 1], B: [0, 0, -1, -1, 0, -1] },
  2: { A: [0, 1, 0, 0, 0, 1], B: [0, -1, 0, 0, 0, -1] },
  3: { A: [1, 1, 0, 0, 0, 0], B: [-1, -1, 0, 0, 0, 0] },
  4: { A: [0, 1, 0, 1, 0, 0], B: [0, -1, 0, -1, 0, 0] },
  5: { A: [1, 1, 1, 0, 0, 0], B: [-1, -1, -1, 0, 0, 0] },
  6: { A: [-1, 0, 1, 0, 0, 0], B: [1, 0, -1, 0, 0, 0] },
  7: { A: [1, 0, 0, 1, -1, 0], B: [-1, 0, 0, -1, 1, 0] },
  8: { A: [0, 0, 1, 0, 1, 0], B: [0, 0, -1, 0, -1, 0] },
  9: { A: [0, 0, 0, 1, -1, 1], B: [0, 0, 0, -1, 1, -1] },
  10: { A: [1, 0, 0, 0, 1, 1], B: [-1, 0, 0, 0, -1, -1] },
  11: { A: [0, 1, 0, 0, 1, 0], B: [0, -1, 0, 0, -1, 0] },
  12: { A: [0, 0, 1, 1, 0, 1], B: [0, 0, -1, -1, 0, -1] },
}

/**
 * 12개 A/B 답변으로 6축 정규화 점수를 계산한다.
 *
 * - 각 축 원점수 범위: -5 ~ +5
 * - 정규화: (원점수 + 5) ÷ 10 → 0.0 ~ 1.0
 * - 50%(0.5) = 중립, 100%(1.0) = + 방향 극단, 0%(0.0) = - 방향 극단
 */
export function calculateResultVector(answers: QuizAnswer[]): number[] {
  const scores = [0, 0, 0, 0, 0, 0]

  for (const { questionId, selected } of answers) {
    const weights = WEIGHT_TABLE[questionId]?.[selected]
    if (!weights) continue
    for (let i = 0; i < 6; i++) {
      scores[i] += weights[i]
    }
  }

  return scores.map((s) => Math.min(1, Math.max(0, (s + 5) / 10)))
}

/**
 * 6축 정규화 점수에서 타입 키를 결정한다.
 *
 * 결정 축: 활동성(index 0) × 사교성(index 2) × 공간지향(index 3)
 * → 각 축 0.5 이상이면 't', 미만이면 'f'
 * → 반환값 예: 'ftf' (힐링·혼자·도시 = 달빛 아래 걷는 고양이)
 */
export type TypeKey =
  | 'ttt'
  | 'ttf'
  | 'tft'
  | 'tff'
  | 'ftt'
  | 'ftf'
  | 'fft'
  | 'fff'

export function getTypeKey(vector: number[]): TypeKey {
  const a = vector[0] >= 0.5 ? 't' : 'f' // 활동성
  const s = vector[2] >= 0.5 ? 't' : 'f' // 사교성
  const n = vector[3] >= 0.5 ? 't' : 'f' // 공간지향
  return (a + s + n) as TypeKey
}

// 문장① — 활동성
const D1 = {
  t: '체력을 아낌없이 쓰는 활동형 여행자예요.',
  f: '천천히 스며드는 여행을 좋아하는 힐링형 여행자예요.',
}

// 문장② — 계획성 × 사교성
const D2: Record<string, string> = {
  tt: '철저한 준비로 혼자만의 루트를 만들며',
  tf: '계획 없이도 혼자 유연하게 움직이는 걸 즐기며',
  ft: '철저한 준비로 일행 모두의 동선을 짜며',
  ff: '즉흥적인 선택으로 함께하는 우연을 사랑하며',
}

// 문장③ — 공간지향
const D3 = {
  t: '자연 속에서 에너지를 충전하는 타입이에요.',
  f: '도시의 문화와 에너지에서 영감을 받는 타입이에요.',
}

// 문장④ — 경험지향 × 소비스타일
const D4: Record<string, string> = {
  tt: '현지 문화를 가성비 있게 깊이 파고드는 걸 즐겨요.',
  tf: '그 지역의 이야기와 역사에 아낌없이 투자해요.',
  ft: '직접 체험하는 여행을 합리적인 가격에 즐겨요.',
  ff: '특별한 체험을 위해서라면 지갑 열기를 주저 않아요.',
}

/**
 * 6축 정규화 점수로 64가지 조합 설명 문구를 생성한다.
 *
 * 문장① (활동성) + 문장② (계획성×사교성) + 문장③ (공간지향) + 문장④ (경험지향×소비스타일)
 */
export function buildDescription(vector: number[]): string {
  const isActivity = vector[0] >= 0.5 // 활동성
  const isPlan = vector[1] >= 0.5 // 계획성
  const isSolo = vector[2] >= 0.5 // 사교성 (+ 방향 = 혼자형)
  const isNature = vector[3] >= 0.5 // 공간지향 (+ 방향 = 자연형)
  const isCulture = vector[4] >= 0.5 // 경험지향 (+ 방향 = 문화형)
  const isBudget = vector[5] >= 0.5 // 소비스타일 (+ 방향 = 가성비형)

  const s1 = isActivity ? D1.t : D1.f
  // d2 키 순서: (사교성 solo) + (계획성 plan) — HTML 명세 d2 객체 기준
  const s2 = D2[(isSolo ? 't' : 'f') + (isPlan ? 't' : 'f')]
  const s3 = isNature ? D3.t : D3.f
  const s4 = D4[(isCulture ? 't' : 'f') + (isBudget ? 't' : 'f')]

  return `${s1} ${s2} ${s3} ${s4}`
}

/**
 * 6축 정규화 점수를 RadarChart용 CompassAxis 배열로 변환한다.
 *
 * - value: 0~100 정수 (result_vector × 100)
 * - badge: 각 축의 성향 레이블 (0.5 기준 t/f 분기)
 * - 축 순서는 COMPASS_AXES_CONFIG 기준 (RadarChart 꼭짓점 배치 순서와 일치)
 */
export function buildCompassAxes(vector: number[]): CompassAxis[] {
  return COMPASS_AXES_CONFIG.map(
    ({ subject, vectorIndex, trueBadge, falseBadge }) => ({
      subject,
      badge: vector[vectorIndex] >= 0.5 ? trueBadge : falseBadge,
      value: Math.round(vector[vectorIndex] * 100),
    })
  )
}
