# 컨벤션 가이드

> 코드 생성, 리뷰, 리팩토링 시 아래 규칙을 반드시 따르세요.
> 규칙에 어긋나는 코드를 생성하거나 제안하지 마세요.

---

## 1. 기술 스택

| 구분      | 기술                 |
| --------- | -------------------- |
| Framework | Next.js (App Router) |
| Language  | TypeScript (strict)  |
| Styling   | Panda CSS            |
| State     | Zustand              |
| Mock API  | MSW                  |
| Chart     | Recharts             |
| HTTP      | Axios                |

---

## 2. 폴더 구조

```
src/
  app/                  # Next.js 라우팅 진입점
  components/
    common/             # Loading, EmptyState 등 공통 상태 컴포넌트
    layout/             # Header, Footer 등 레이아웃
    ui/                 # Button, Input, Card 등 기본 UI
  features/
    home/
    auth/
    explore/
    test/
    result/
    mypage/
  mocks/
    data/               # 목업 데이터
    handlers.ts
    browser.ts
  store/                # Zustand 스토어
  styles/               # 전역 스타일
  lib/                  # axios 인스턴스, 외부 라이브러리 설정
  types/                # 전역 공통 타입
  utils/                # 순수 유틸 함수
```

---

## 3. 네이밍 규칙

### 파일 / 폴더

| 대상            | 형식                       | 예시             |
| --------------- | -------------------------- | ---------------- |
| 컴포넌트 파일   | PascalCase                 | `LoginForm.tsx`  |
| 컴포넌트 폴더   | PascalCase                 | `LoginForm/`     |
| 페이지 컴포넌트 | PascalCase + `Page` suffix | `LoginPage.tsx`  |
| 훅              | camelCase + `use` prefix   | `useAuth.ts`     |
| 스토어          | camelCase + `Store` suffix | `authStore.ts`   |
| 유틸 / 헬퍼     | camelCase                  | `formatDate.ts`  |
| 상수            | camelCase                  | `routes.ts`      |
| 타입 파일       | camelCase + `.types`       | `user.types.ts`  |
| 일반 폴더       | kebab-case                 | `design-tokens/` |

### Props

| 상황          | 예시                                |
| ------------- | ----------------------------------- |
| boolean       | `isOpen`, `isLoading`, `isDisabled` |
| 이벤트 핸들러 | `onClick`, `onSubmit`, `onClose`    |
| 리스트        | `travels`, `reviews`                |
| 단일          | `travel`, `user`                    |

### API 함수

| 메서드 | 형식            | 예시                              |
| ------ | --------------- | --------------------------------- |
| GET    | `get` + 명사    | `getTravels`, `getTravelDetail`   |
| POST   | `post` + 명사   | `postLogin`, `postRecommendation` |
| PATCH  | `patch` + 명사  | `patchUserProfile`                |
| DELETE | `delete` + 명사 | `deleteSavedTravel`               |

---

## 4. TypeScript

### 규칙

- `any` 사용 **금지** — `unknown` 또는 명확한 타입 사용
- API 응답 타입과 UI 표시용 타입을 **분리**
- nullable 값은 `| null` 또는 optional(`?`)로 명확히 표현

### 타입 vs 인터페이스 사용 기준

| 상황             | 사용        |
| ---------------- | ----------- |
| 객체 데이터 구조 | `type`      |
| 컴포넌트 Props   | `interface` |
| API 응답 타입    | `type`      |
| union 타입       | `type`      |

### 예시

```ts
// ✅ 올바른 예시
type Travel = {
  id: number
  title: string
  location: string
  imageUrl: string
}

interface TravelCardProps {
  travel: Travel
  isLoading?: boolean
  onClick: () => void
}

// ❌ 금지
const data: any = response.data
```

---

## 5. 컴포넌트

### Server / Client Component 기준

| 상황                          | 컴포넌트                  |
| ----------------------------- | ------------------------- |
| 데이터 페칭, 서버 리소스      | Server Component (기본값) |
| 순수 UI, props만 받는 경우    | Server Component          |
| `useState`, `useEffect` 사용  | Client Component          |
| 이벤트 핸들러 사용            | Client Component          |
| `window`, `localStorage` 사용 | Client Component          |
| Recharts, Zustand 직접 사용   | Client Component          |

**원칙: `'use client'` 경계는 가능한 한 말단 컴포넌트까지 내린다.**

```
page.tsx                # Server
  └── ResultPage.tsx    # Server
        └── ChartSection.tsx  # Client ← 여기서만 'use client'
```

### 컴포넌트 작성 규칙

- 컴포넌트는 **하나의 역할**만 담당
- Props 타입은 파일 **상단**에 작성
- 재사용 컴포넌트 → `components/`
- 특정 기능 전용 컴포넌트 → `features/{domain}/`

### 예시

```tsx
// ✅ 올바른 예시
interface TravelCardProps {
  title: string
  location: string
  imageUrl: string
  onClick: () => void
}

export default function TravelCard({
  title,
  location,
  imageUrl,
  onClick,
}: TravelCardProps) {
  return (
    <article onClick={onClick}>
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{location}</p>
    </article>
  )
}
```

---

## 6. 함수 작성

### 규칙

- 함수는 **하나의 작업**만 담당
- 외부 데이터는 직접 참조하지 않고 **파라미터로** 받음
- 배열 / 객체 **원본 수정 금지** (불변성 유지)
- 조건문은 **항상 중괄호** 사용 (한 줄 if 금지)
- 복잡한 조건은 **변수로 분리**

```ts
// ✅ 조건문
if (!user) {
  return null
}

// ❌ 금지
if (!user) return null

// ✅ 복잡한 조건 분리
const isAvailableRecommendation =
  selectedRegion !== null && selectedStyle !== null

if (!isAvailableRecommendation) {
  return
}
```

---

## 7. import 순서

아래 순서를 반드시 지킨다.

```ts
// 1. 외부 라이브러리
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. 내부 모듈 (alias 사용)
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

// 3. 타입
import type { Travel } from '../types/travel.types'

// 4. 스타일 (해당하는 경우)
import { css } from '@/styled-system/css'
```

- 경로가 깊은 경우 반드시 alias(`@/`) 사용
- 같은 도메인 내부는 상대 경로 허용

---

## 8. 스타일링 (Panda CSS)

### 규칙

- 색상, 간격, radius, typography는 **디자인 토큰** 우선 사용
- **하드코딩 색상 금지** (`#fff`, `rgba(...)` 직접 사용 지양)
- 반복되는 UI 패턴은 **recipe**로 분리
- 전역 스타일 최소화

```tsx
// ✅ 올바른 예시
import { css } from '@/styled-system/css'

const cardStyle = css({
  borderRadius: 'lg',
  bg: 'white',
  p: 'md',
  shadow: 'sm',
})

// ❌ 금지
const cardStyle = css({
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  padding: '16px',
})
```

---

## 9. 상태 관리 (Zustand)

### Zustand를 사용하는 경우

- 여러 페이지 / 컴포넌트에서 **공유**되는 상태
- 로그인 사용자 정보, 설문 진행 상태, 추천 결과, 전역 모달, 검색 조건

### Zustand를 사용하지 않는 경우

- 단일 input 상태
- 특정 컴포넌트 내부에서만 쓰는 UI 상태
- hover, toggle 등 단순 UI 상태

```ts
// ✅ 스토어 예시
import { create } from 'zustand'

interface UiStore {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))
```

---

## 10. API 작성

### 규칙

- API 함수는 **컴포넌트 내부에 작성 금지**
- 응답 타입 **명시 필수**
- 에러 처리는 **호출부**에서
- 실제 API 명세와 mock 데이터 구조 **일치**

```ts
// 위치: src/features/travel/api/travelApi.ts

import { axiosInstance } from '@/lib/axios'
import type { TravelResponse } from '../types/travel.types'

export const getTravels = async (): Promise<TravelResponse[]> => {
  const response = await axiosInstance.get<TravelResponse[]>('/travels')
  return response.data
}
```

---

## 11. 상수 관리

반복 사용되는 문자열, 라우트, 옵션은 상수로 분리한다.

```ts
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  RESULT: '/result',
  MYPAGE: '/mypage',
} as const
```

---

## 12. console 사용

- 개발 중 임시 `console.log`는 허용
- PR 전 **반드시 제거**
- 에러 로깅은 `console.error`에 명확한 메시지 포함

---

## 13. 접근성

```tsx
// ✅ 아이콘 버튼 — aria-label 필수
<button aria-label="검색하기">
  <SearchIcon />
</button>

// ✅ input — label 연결 필수
<label htmlFor="email">이메일</label>
<input id="email" type="email" />

// ✅ 단순 이동 — button 대신 Link 사용
<Link href={ROUTES.HOME}>홈으로</Link>
```

---

## 14. 브랜치 네이밍

```
<type>/<이슈번호>-<간단한-설명>
```

| 타입       | 설명             |
| ---------- | ---------------- |
| `feat`     | 새 기능          |
| `fix`      | 버그 수정        |
| `refactor` | 리팩토링         |
| `docs`     | 문서             |
| `chore`    | 빌드, 설정, 기타 |
| `style`    | UI/스타일 변경   |
| `test`     | 테스트           |

**예시**

```
feat/12-login-page
fix/22-auth-token-expired
docs/14-add-convention
```

---

## 15. 커밋 메시지

```
<type>: <설명> (#이슈번호)
```

| 타입       | 설명         |
| ---------- | ------------ |
| `feat`     | 새로운 기능  |
| `fix`      | 버그 수정    |
| `refactor` | 리팩토링     |
| `style`    | UI / 스타일  |
| `docs`     | 문서         |
| `test`     | 테스트       |
| `chore`    | 설정, 패키지 |
| `build`    | 빌드 설정    |
| `ci`       | CI 설정      |
| `perf`     | 성능 개선    |

```
feat: 로그인 기능 추가 (#12)
fix: 토큰 만료 오류 수정 (#15)
docs: 컨벤션 문서 추가
```

> pre-commit 훅에서 형식 자동 검증됨 (`<type>: <설명>` 미준수 시 커밋 차단)

---

## 16. Git 이슈

이슈 타입은 두 가지입니다.

### Bug Report

- **제목 형식:** `[Bug]: <버그 설명>`
- **필수 항목:** 버그 설명, 재현 방법, 기대 동작, 실제 동작
- **선택 항목:** 스크린샷, 환경 (브라우저)

### Feature Request

- **제목 형식:** `[Feature]: <기능 설명>`
- **필수 항목:** 기능 설명, 필요한 이유
- **선택 항목:** 제안하는 해결 방법, 대안, 추가 정보

---

## 17. Pull Request

**제목 형식**

```
<type>: <설명> (#이슈번호)
```

**예시**

```
feat: 로그인 페이지 구현 (#12)
fix: 다크모드 토글 버그 수정 (#18)
```

**본문 구성** (`pull_request_template.md` 기준)

```markdown
## 관련 이슈

- closes #이슈번호

## 작업 내용

-

## 변경 사항

-

## 스크린샷 (선택)

## 체크리스트

- [ ] 코드가 정상적으로 동작하는지 확인했습니다
- [ ] 불필요한 console.log 또는 디버깅 코드를 제거했습니다
- [ ] 컨벤션에 맞게 작성했습니다
```

---

## 18. AI 코드 생성 체크리스트

AI가 코드를 생성하거나 수정할 때 아래 항목을 모두 검토한다.

```
□ any 타입을 사용하지 않았는가?
□ Props 타입이 interface로 파일 상단에 선언되어 있는가?
□ 컴포넌트가 단일 책임을 가지는가?
□ 'use client'가 꼭 필요한 경우에만 사용되었는가?
□ import 순서가 (외부 → 내부 → 타입 → 스타일) 순서인가?
□ 조건문에 중괄호가 사용되었는가?
□ API 함수가 컴포넌트 외부에 분리되어 있는가?
□ 스타일에 하드코딩 색상이 없는가?
□ Zustand가 전역 공유 상태에만 사용되었는가?
□ 불필요한 console.log가 없는가?
□ 파일명이 네이밍 규칙에 맞는가?
```
