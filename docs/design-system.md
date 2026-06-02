# TravelMaker Design System

이 문서는 페이지 개발 전에 TravelMaker의 전역 스타일, Panda CSS 디자인 토큰, 공통 UI 스타일 기준을 맞추기 위한 기준 문서다. 실제 페이지 UI 구현보다 기준 안정화가 목적이므로, 컴포넌트 대량 구현은 이 문서 범위에 포함하지 않는다.

## 디자인 토큰을 사용하는 이유

- 페이지마다 직접 색상, 간격, radius, shadow 값을 입력하면 같은 UI가 조금씩 달라진다.
- Panda CSS token을 기준으로 삼으면 디자인 변경 시 `panda.config.ts`에서 중심 값을 바꾸고 컴포넌트는 의미 기반 이름을 유지할 수 있다.
- 팀원과 AI 코딩 도구가 같은 이름의 토큰을 쓰게 되어, 페이지 개발 속도보다 일관성과 유지보수성을 먼저 확보할 수 있다.
- `primary`, `text.primary`, `bg.canvas`처럼 역할이 드러나는 이름을 쓰면 색상 값 자체보다 UI 의도가 코드에 남는다.

## public/tokens.json을 그대로 사용하지 않는 이유

`public/tokens.json`은 팀원이 정리한 참고 자료지만, 최종 디자인 기준은 제공된 디자인 가이드 이미지와 아래 명시 컬러다. JSON에는 최종 기준과 다른 색상 값이 포함되어 있으므로 자동 변환해서 Panda token으로 반영하지 않는다.

원칙:

- 확정 컬러는 이 문서의 최종 컬러 기준을 우선한다.
- JSON 값과 최종 기준이 다르면 값을 섞지 않는다.
- 불일치는 "tokens.json 참고값과 최종 기준의 차이"에 기록한다.
- spacing, radius, shadow는 JSON을 참고하되, 디자인 가이드 이미지와 비교해 확정하기 어려운 값은 TODO로 남긴다.

## 최종 컬러 기준

| 의미           | 최종 값   | Panda semantic token |
| -------------- | --------- | -------------------- |
| primary        | `#2CA6BE` | `primary`            |
| primary-soft   | `#D8F3FA` | `primary.soft`       |
| primary-hover  | `#009BB2` | `primary.hover`      |
| success        | `#2DBE7E` | `success`            |
| warning        | `#E5484D` | `warning`            |
| text-primary   | `#263238` | `text.primary`       |
| text-secondary | `#8A9AA0` | `text.secondary`     |
| border         | `#B1BBBF` | `border`             |
| background     | `#F6FAFC` | `bg.canvas`          |

보조 배경과 면 색상:

- `bg.surface`: `#FFFFFF`
- `bg.muted`: `#EEF4F6`
- `border.subtle`: `#DCE5E8`
- `text.inverse`: `#FFFFFF`

## tokens.json 참고값과 최종 기준의 차이

| 항목           | `public/tokens.json` 참고값        | 최종 기준 | 처리                                                |
| -------------- | ---------------------------------- | --------- | --------------------------------------------------- |
| primary        | `color.primary.default = #00ADC7`  | `#2CA6BE` | 최종 기준 사용                                      |
| primary-soft   | `color.primary.light = #D0F7F9`    | `#D8F3FA` | 최종 기준 사용                                      |
| primary-hover  | `color.primary.dark = #009BB2`     | `#009BB2` | 일치, 최종 기준 사용                                |
| success        | 없음                               | `#2DBE7E` | 최종 기준 사용                                      |
| warning        | `color.semantic.warning = #F48C06` | `#E5484D` | 최종 기준 사용. 현재 명시값은 경고/위험 계열로 사용 |
| text-primary   | `color.text.primary = #1D2B34`     | `#263238` | 최종 기준 사용                                      |
| text-secondary | `color.text.secondary = #3D494C`   | `#8A9AA0` | 최종 기준 사용                                      |
| border         | `color.border.default = #B1BBBF`   | `#B1BBBF` | 일치, 최종 기준 사용                                |
| background     | `color.background.page = #FBF9F8`  | `#F6FAFC` | 최종 기준 사용                                      |

추가 참고:

- `tokens.json`의 `color.semantic.error = #BA1A1A`는 이번 최종 컬러 기준에 없으므로 Panda token으로 확정하지 않았다. TODO: error 색상이 별도로 필요한지 디자인 가이드에서 확인한다.
- `tokens.json`의 `color.semantic.kakao = #FEE500`은 브랜드 로그인 등 특정 기능에서 필요할 수 있으나, 이번 전역 디자인 토큰 기준에는 포함하지 않았다. TODO: 카카오 로그인 UI 구현 시 별도 컴포넌트 token으로 분리한다.
- `tokens.json`의 `primary.darker`, `primary.surface`, `border.focus`, `border.active`, `border.subtle`은 참고값으로만 둔다. focus 색상은 현재 `primary` 기반 shadow token으로 임시 정리했다.

## Panda CSS token naming 기준

Panda token은 raw color 이름보다 semantic token을 우선한다.

좋은 예:

```tsx
css({
  color: 'text.primary',
  bg: 'bg.surface',
  borderColor: 'border',
})
```

피해야 할 예:

```tsx
css({
  color: '#263238',
  bg: 'teal.500',
})
```

원칙:

- 컴포넌트에서는 `primary`, `text.primary`, `bg.canvas`, `border` 같은 역할 기반 이름을 우선 사용한다.
- `teal.500`, `gray.900` 같은 primitive token은 `panda.config.ts` 내부에서 semantic token을 구성할 때 주로 사용한다.
- 상태는 `primary.hover`, `success`, `warning`처럼 의미와 상태가 함께 드러나게 한다.
- 새 token이 필요하면 먼저 기존 semantic token으로 표현 가능한지 확인한다.
- 값이 확정되지 않은 색상은 임의로 만들지 말고 문서에 TODO로 남긴다.

## Typography

기본 폰트는 `Pretendard Variable`을 사용한다. `src/app/layout.tsx`에서 `next/font/local`로 `--font-pretendard` 변수를 등록하고, Panda `fonts.body`와 `globals.css`가 이 변수를 참조한다.

기준:

| 용도         | token                     | 값                 |
| ------------ | ------------------------- | ------------------ |
| 본문 기본    | `fontSizes.md`            | `16px`             |
| 보조 텍스트  | `fontSizes.sm`            | `14px`             |
| 작은 라벨    | `fontSizes.xs`            | `12px`             |
| 섹션 제목    | `fontSizes.xl` 또는 `2xl` | `20px` 또는 `24px` |
| 페이지 제목  | `fontSizes.3xl`           | `32px`             |
| 본문 줄 높이 | `lineHeights.normal`      | `1.5`              |

TODO: 디자인 가이드 이미지에서 페이지별 제목, 카드 제목, 버튼 텍스트의 정확한 타입 스케일을 재확인한다.

## Spacing

기본 spacing은 4px grid를 기준으로 한다.

| token        | 값     | 주 용도                |
| ------------ | ------ | ---------------------- |
| `spacing.1`  | `4px`  | 작은 아이콘 간격       |
| `spacing.2`  | `8px`  | 태그 내부, 작은 gap    |
| `spacing.3`  | `12px` | 버튼 내부 gap          |
| `spacing.4`  | `16px` | 카드 내부 기본 padding |
| `spacing.6`  | `24px` | 섹션 내부 padding      |
| `spacing.8`  | `32px` | 페이지 섹션 간격       |
| `spacing.12` | `48px` | 큰 섹션 간격           |

TODO: 디자인 가이드 이미지 기준으로 모바일/데스크톱 페이지 gutter 값을 확정한다.

## Radius

`tokens.json`의 radius 값은 형태 기준으로 참고한다. 현재 Panda 기준은 아래처럼 단순화한다.

| token        | 값       | 주 용도           |
| ------------ | -------- | ----------------- |
| `radii.xs`   | `3px`    | 작은 구분 요소    |
| `radii.sm`   | `8px`    | 버튼, 입력 필드   |
| `radii.md`   | `10px`   | 태그, 작은 카드   |
| `radii.lg`   | `12px`   | 기본 카드         |
| `radii.xl`   | `16px`   | 모달, 큰 패널     |
| `radii.pill` | `9999px` | pill button, chip |

TODO: `tokens.json`의 `3xl = 25px`, `full = 28px`, `pill = 36px`, `circle = 62px`가 실제 디자인 가이드 이미지와 일치하는지 확인한다.

## Shadow

현재 기준은 과한 그림자를 줄이고, 인터페이스가 가볍게 떠 보이는 정도만 사용한다.

| token           | 값                                   | 주 용도           |
| --------------- | ------------------------------------ | ----------------- |
| `shadows.sm`    | `0 1px 2px rgba(38, 50, 56, 0.08)`   | Header, 얕은 구분 |
| `shadows.md`    | `0 8px 24px rgba(38, 50, 56, 0.10)`  | Card, Modal       |
| `shadows.focus` | `0 0 0 3px rgba(44, 166, 190, 0.24)` | 키보드 focus      |

TODO: `tokens.json`의 `shadow.card`는 `0px 12px 40px rgba(0,0,0,0.2)`가 포함되어 있어 현재 여행 서비스 UI 기준으로는 강해 보인다. 디자인 가이드 이미지에서 모달/카드 elevation을 확인한 뒤 확정한다.

## Border

기본 border는 `border` token을 사용한다.

- 기본 선: `borderWidth: '1px'`, `borderColor: 'border'`
- 약한 구분선: `borderColor: 'border.subtle'`
- focus outline은 border 색상을 바꾸기보다 `shadows.focus`를 우선 사용한다.

## 전역 스타일 작성 기준

- 전역 CSS는 `src/styles/globals.css`에 둔다.
- `globals.css`에는 Panda layer 선언, body 기본 폰트, 배경, 텍스트 색상, 기본 element reset만 둔다.
- 페이지별 레이아웃, 카드, 버튼, 폼 스타일은 global selector로 작성하지 않는다.
- 특정 컴포넌트 스타일은 Panda `css`, `cva`, recipe 또는 컴포넌트 내부 style module로 분리한다.
- `html`, `body`의 배경은 `bg.canvas`, 기본 텍스트는 `text.primary`를 따른다.
- 새 global selector를 추가해야 한다면 모든 페이지에 영향을 주는지 먼저 확인한다.

## 컴포넌트 구현 시 스타일 규칙

- 색상은 semantic token을 우선 사용한다.
- hover, active, disabled, focus-visible 상태를 함께 설계한다.
- 직접 hex 값을 넣지 않는다. 예외가 필요하면 문서에 이유를 남긴다.
- 레이아웃용 spacing은 4px grid token을 사용한다.
- 카드 안에 카드가 중첩되는 구조를 피한다.
- 텍스트가 버튼이나 태그 내부에서 줄바꿈되거나 잘리지 않도록 min-width, white-space, padding을 함께 확인한다.
- 접근성을 위해 interactive element에는 `focus-visible` 스타일을 둔다.
- Server Component를 기본으로 사용하고, 이벤트나 브라우저 API가 필요한 말단 컴포넌트에만 `'use client'`를 둔다.

## 컴포넌트별 스타일 기준

### Button

- Primary button: `bg: 'primary'`, `color: 'text.inverse'`, hover는 `primary.hover`.
- Secondary button: `bg: 'primary.soft'`, `color: 'primary'`, hover는 약한 border 또는 `bg.muted`.
- Radius는 기본 `radii.sm` 또는 pill 형태가 필요한 CTA에만 `radii.pill`.
- Disabled는 opacity만 낮추지 말고 배경, 텍스트 대비를 함께 확인한다.

### Tag

- 정보성 tag는 `primary.soft` 배경과 `primary` 텍스트를 사용한다.
- 상태 tag는 `success`, `warning`을 사용하되, 배경 soft tone이 필요하면 TODO로 색상을 확정한 뒤 추가한다.
- Radius는 `radii.md` 또는 `radii.pill`.

### Card

- 기본 배경은 `bg.surface`.
- Border는 `border.subtle` 또는 `border`.
- Radius는 `radii.lg`.
- Shadow는 리스트 카드에서는 최소화하고, 강조 카드에만 `shadows.sm` 또는 `shadows.md`를 사용한다.

### Modal

- Modal surface는 `bg.surface`, radius는 `radii.xl`.
- Dim overlay 색상은 아직 확정하지 않는다. TODO: 디자인 가이드 이미지 기준으로 overlay token을 추가한다.
- Modal shadow는 임시로 `shadows.md`를 사용한다.
- 닫기 버튼, 확인 버튼, focus trap 등 접근성 동작은 구현 시 별도 검증한다.

### Header

- Header 배경은 `bg.surface` 또는 투명 배경이 필요한 페이지에서만 예외 처리한다.
- 하단 구분선은 `border.subtle`.
- 로고/현재 메뉴는 `text.primary`, 일반 메뉴는 `text.secondary`, hover는 `primary`.
- 페이지별로 Header 높이를 임의 변경하지 않는다.

### Footer

- Footer 배경은 `bg.surface` 또는 `bg.muted`.
- 상단 구분선은 `border.subtle`.
- 본문 정보는 `text.secondary`, 브랜드명은 `text.primary`.
- Footer는 페이지 콘텐츠보다 시각적 우선순위가 낮아야 한다.

## 페이지 작업 사용 예시

```tsx
import { css } from '@/styled-system/css'

export function ExampleCard() {
  return (
    <section
      className={css({
        bg: 'bg.surface',
        color: 'text.primary',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        borderRadius: 'lg',
        p: '6',
        boxShadow: 'sm',
      })}
    >
      <h2 className={css({ fontSize: 'xl', fontWeight: 'semibold' })}>
        추천 여행지
      </h2>
      <p className={css({ mt: '2', color: 'text.secondary', fontSize: 'sm' })}>
        취향에 맞는 여행 코스를 확인하세요.
      </p>
    </section>
  )
}
```

```tsx
import { css } from '@/styled-system/css'

export const primaryButton = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  px: '5',
  borderRadius: 'sm',
  bg: 'primary',
  color: 'text.inverse',
  fontWeight: 'semibold',
  _hover: { bg: 'primary.hover' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
  _disabled: { bg: 'bg.muted', color: 'text.secondary' },
})
```

## AI 코딩 도구 주의사항

- `public/tokens.json`을 자동 변환해서 그대로 `panda.config.ts`에 넣지 않는다.
- 사용자가 명시한 최종 컬러 기준을 항상 우선한다.
- 색상이 애매하면 추측하지 않고 이 문서에 TODO를 남긴다.
- 페이지 UI 구현이나 리팩토링을 디자인 시스템 정리 작업에 섞지 않는다.
- 새 라이브러리를 추가하지 않는다.
- 컴포넌트 대량 생성보다 token, global style, 문서 기준을 먼저 유지한다.
- Panda CSS 사용 예시는 semantic token으로 작성한다.
- Next.js 관련 변경 전에는 `node_modules/next/dist/docs/`의 현재 버전 문서를 확인한다.

## Panda CSS 작성 컨벤션

공통 컴포넌트와 페이지 UI는 Panda CSS의 `css`, `cva`를 사용해 스타일을 작성한다.
기본 원칙은 디자인 토큰을 우선 사용하고, JSX 구조와 긴 스타일 객체가 섞이지 않도록 관리하는 것이다.

### `css` 사용 기준

짧고 단순한 스타일은 JSX 내부에서 `css({})`를 직접 사용할 수 있다.

```tsx
<h2 className={css({ fontSize: 'xl', fontWeight: 'semibold' })}>추천 여행지</h2>
```

다만 스타일 객체가 길어지거나 hover, focus-visible, disabled 같은 상태 스타일이 포함되면 컴포넌트 상단의 `const`로 분리한다.

```tsx
const profileLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '10',
  height: '10',
  borderRadius: 'pill',
  bg: 'primary.soft',
  borderWidth: '1px',
  borderColor: 'primary',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  transitionProperty: 'border-color, box-shadow, transform',
  transitionDuration: '150ms',
  _hover: {
    boxShadow: 'focus',
    transform: 'translateY(-1px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})
```

```tsx
<Link
  href={ROUTES.PROFILE('me')}
  aria-label="마이페이지로 이동"
  className={profileLinkStyle}
>
  TM
</Link>
```

기준:

- 1~3줄 정도의 단순 스타일은 JSX 내부 `css({})`를 허용한다.
- 스타일 객체가 길어지면 의미 있는 이름의 `const`로 분리한다.
- hover, focus-visible, disabled 상태가 포함되면 가능한 `const`로 분리한다.
- 동일한 스타일이 반복되면 공통 style const, `cva`, 공통 컴포넌트 분리를 검토한다.

### `cva` 사용 기준

`variant`, `size`, `shape`, `tone`, `fullWidth`처럼 조합 가능한 옵션이 있는 컴포넌트는 `cva` 사용을 우선 검토한다.

대표 대상:

- Button
- IconButton
- Badge
- Tag
- Chip
- Card variant

예시:

```tsx
const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'semibold',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
    _disabled: {
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'primary',
        color: 'text.inverse',
        _hover: {
          bg: 'primary.hover',
        },
      },
      secondary: {
        bg: 'primary.soft',
        color: 'primary',
        borderWidth: '1px',
        borderColor: 'primary',
      },
      neutral: {
        bg: 'bg.muted',
        color: 'text.primary',
      },
    },
    size: {
      sm: {
        minHeight: '9',
        px: '4',
        fontSize: 'sm',
      },
      md: {
        minHeight: '11',
        px: '5',
        fontSize: 'md',
      },
    },
    shape: {
      rounded: {
        borderRadius: 'sm',
      },
      pill: {
        borderRadius: 'pill',
      },
    },
    fullWidth: {
      true: {
        width: 'full',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
  },
})
```

`cva`는 모든 컴포넌트에 무조건 적용하지 않는다.
옵션 조합이 거의 없는 Header, Footer 같은 레이아웃 컴포넌트는 의미 있는 style const로 분리하는 것을 우선한다.

### Header/Footer 스타일 작성 기준

Header와 Footer는 서비스 전역 레이아웃에 해당하므로, JSX에서 구조가 먼저 읽히도록 스타일 객체를 분리한다.

좋은 예:

```tsx
const headerStyle = css({
  bg: 'bg.surface',
  borderBottomWidth: '1px',
  borderColor: 'border.subtle',
})

const navLinkStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  _hover: {
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})
```

```tsx
<header className={headerStyle}>
  <Link href={ROUTES.HOME} className={logoStyle}>
    TravelMaker
  </Link>

  <nav aria-label="주요 메뉴" className={navStyle}>
    <Link href={ROUTES.RECOMMENDATION} className={navLinkStyle}>
      Travel Style
    </Link>
  </nav>
</header>
```

기준:

- Header/Footer는 무리하게 `cva`로 추상화하지 않는다.
- `headerStyle`, `navStyle`, `navLinkStyle`, `footerStyle`, `footerGridStyle`처럼 역할이 드러나는 이름을 사용한다.
- 페이지별 Header/Footer 스타일 변경은 최소화한다.
- 로그인 상태, 드롭다운, 모바일 메뉴 인터랙션은 별도 컴포넌트 또는 별도 이슈로 분리한다.

### 스타일 분리 기준

| 상황                      | 권장 방식                           |
| ------------------------- | ----------------------------------- |
| 짧은 1~3줄 스타일         | JSX 내부 `css({})` 허용             |
| 긴 스타일 객체            | 컴포넌트 상단 `const`로 분리        |
| hover/focus/disabled 포함 | 가능하면 `const`로 분리             |
| variant/size 조합 존재    | `cva` 사용 검토                     |
| 여러 파일에서 재사용      | 공통 컴포넌트 또는 recipe 분리 검토 |
| 디자인 값이 확정되지 않음 | 임의 token 추가 금지, TODO 작성     |

### 주의사항

- 스타일 정리 작업에서 UI 디자인을 임의로 변경하지 않는다.
- raw hex, 임의 px 값은 가능한 사용하지 않는다.
- 새 token이 필요하면 기존 semantic token으로 표현 가능한지 먼저 확인한다.
- 접근성 관련 `aria-label`, `focus-visible`, `disabled` 스타일은 제거하지 않는다.
- 공통 컴포넌트는 팀원이 참고할 기준 코드가 되므로, 구조와 스타일 책임이 명확하게 보이도록 작성한다.
