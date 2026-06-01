# AI Coding Guide

TravelMaker에서 AI 코딩 도구가 스타일 작업을 할 때 지켜야 할 최소 기준이다. 자세한 디자인 시스템 기준은 `docs/design-system.md`를 우선한다.

## 우선순위

1. 사용자가 명시한 최종 컬러 기준
2. 디자인 가이드 이미지
3. `docs/design-system.md`
4. `public/tokens.json` 참고값

`public/tokens.json`은 참고 자료이며 자동 변환 대상이 아니다.

## 스타일 작업 규칙

- Panda CSS semantic token을 우선 사용한다.
- 새 색상 hex 값을 임의로 만들지 않는다.
- 확정되지 않은 spacing, radius, shadow는 TODO로 남긴다.
- 페이지 UI 구현, 컴포넌트 대량 리팩토링, 새 라이브러리 추가를 디자인 기준 정리 작업에 섞지 않는다.
- global style은 `src/styles/globals.css`와 `panda.config.ts`의 `globalCss` 범위에서만 최소화한다.
- 컴포넌트 구현 시 hover, disabled, focus-visible 상태를 함께 고려한다.
- Next.js 동작과 관련된 변경 전에는 `node_modules/next/dist/docs/`의 현재 버전 문서를 확인한다.

## Panda token 사용 예시

```tsx
css({
  bg: 'bg.surface',
  color: 'text.primary',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  p: '6',
})
```

피해야 할 방식:

```tsx
css({
  backgroundColor: '#FFFFFF',
  color: '#263238',
})
```
