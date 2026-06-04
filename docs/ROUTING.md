# 라우팅 구조 가이드

## 목차

- [전체 구조](#전체-구조)
- [페이지별 상세 설명](#페이지별-상세-설명)
- [현재 레포와의 차이점](#현재-레포와의-차이점)
- [구현 시 주의사항](#구현-시-주의사항)

---

## 전체 구조

```
src/
└── app/
    ├── layout.tsx                  # 공통 레이아웃 (Header, Footer)
    ├── page.tsx                    # 메인 페이지 (/)
    ├── error.tsx                   # 공통 에러 UI
    ├── loading.tsx                 # 공통 로딩 UI
    ├── not-found.tsx               # 404 페이지
    │
    ├── dev/
    │   └── page.tsx                # 개발용 UI 플레이그라운드 (/dev) — 프로덕션 미포함
    │
    ├── explore/
    │   └── page.tsx                # 탐색 페이지 (/explore)
    │
    ├── detail/
    │   └── [id]/
    │       └── page.tsx            # 여행지 상세 페이지 (/detail/123)
    │
    ├── profile/
    │   └── [userId]/
    │       ├── page.tsx            # 프로필 페이지 (/profile/user123)
    │       └── edit/
    │           └── page.tsx        # 프로필 수정 페이지 (/profile/user123/edit)
    │
    └── test/
        ├── page.tsx                # 성향 테스트 질문 페이지 (/test)
        └── result/
            └── page.tsx            # 테스트 결과 페이지 (/test/result)
```

> `(auth)/login` Route Group은 아직 미구현이다. 현재 로그인 페이지 경로는 미확정 상태이며, 백엔드 OAuth 연동 설계 후 추가 예정이다.

---

## 페이지별 상세 설명

### `layout.tsx` — 공통 레이아웃

모든 페이지에서 공유하는 최상위 레이아웃. `<Header />`와 `<Footer />`를 여기에 배치하면 페이지 이동 시 헤더/푸터는 리렌더링되지 않고 `children`(내부 콘텐츠)만 교체된다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <div
          className={css({
            minH: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bg: 'bg.canvas',
            color: 'text.primary',
          })}
        >
          <Header />
          <main className={css({ flex: 1, minW: 0 })}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

---

### `/` — 메인 페이지

서비스 진입점. 여행지 추천 배너, 성향 테스트 유도 CTA 등을 배치한다.

- 비로그인 유저도 접근 가능
- `?showLogin=true` 쿼리 파라미터를 감지하면 로그인 모달을 띄운다 → [상세 페이지 진입 처리](#detail-id--여행지-상세-페이지) 참고

---

### `/explore` — 탐색 페이지

필터 조건(지역, 테마 등)을 적용해 여행지 목록을 탐색하는 페이지.

- 비로그인 유저도 접근 가능
- 마찬가지로 `?showLogin=true` 감지 시 로그인 모달 출력

**페이지네이션 방식: URL 쿼리 파라미터**

무한 스크롤 없이 페이지 단위로 목록을 이동한다. 현재 페이지 번호는 URL에 반영하여 새로고침·공유·뒤로가기 시에도 동일한 페이지가 유지되도록 한다.

```
/explore?page=1
/explore?page=2
/explore?page=1&region=jeju&theme=nature   ← 필터와 함께 사용
```

```tsx
// app/explore/page.tsx
export default function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; region?: string; theme?: string }>
}) {
  const { page, region, theme } = await searchParams
  const currentPage = Number(page) || 1

  // currentPage 값으로 서버에서 해당 페이지 데이터 페칭
}
```

> Next.js 15부터 `searchParams`는 `Promise` 타입이므로 `await`로 언래핑해야 한다.

- `page` 파라미터가 없으면 기본값 1로 처리
- 필터(지역, 테마 등)도 동일한 쿼리 파라미터로 관리하여 필터 변경 시 `page=1`로 초기화

---

### `/detail/[id]` — 여행지 상세 페이지

동적 라우팅(Dynamic Routes)으로 여행지 ID에 따라 개별 상세 정보를 표시한다.

```
/detail/123   → id = "123"
/detail/seoul → id = "seoul"
```

**비로그인 유저 접근 처리 (Middleware 방식)**

`middleware.ts`에서 비로그인 유저의 `/detail/*` 접근을 가로채고, `?showLogin=true`를 붙여 메인 페이지로 리다이렉트한다.

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = !!request.cookies.get('access_token')
  const isDetailPage = request.nextUrl.pathname.startsWith('/detail')

  if (isDetailPage && !isLoggedIn) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('showLogin', 'true')
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/detail/:path*'],
}
```

> `access_token` 쿠키 유무로 로그인 여부를 판단한다. 백엔드 인증 방식 변경 시 쿠키 키 이름도 함께 수정해야 한다.

**`params`는 async로 받아야 한다 (Next.js 15)**

```tsx
// app/detail/[id]/page.tsx
export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // id 값으로 여행지 데이터 페칭
}
```

**`id` 값의 결정**

| 방식               | 예시             | 특징                        |
| ------------------ | ---------------- | --------------------------- |
| 공공데이터 원본 ID | `/detail/126508` | 별도 DB 없이 바로 사용 가능 |
| 자체 DB UUID       | `/detail/a1b2c3` | 데이터 가공·관리에 유리     |

→ 백엔드팀과 합의 후 결정 필요.

---

### `/profile/[userId]` — 프로필 페이지

동적 라우팅 하나로 **본인 프로필**과 **타인 프로필**을 모두 처리한다.

```tsx
// app/profile/[userId]/page.tsx
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  // 세션 정보를 서버에서 조회하여 본인/타인 여부 판단
  // const session = await getServerSession()
  // const isMyProfile = session?.user?.id === userId
}
```

> Next.js 15에서 `params`는 `Promise` 타입이다. `useSession` 같은 Client Hook 대신 서버에서 세션을 조회하는 방식을 사용한다.

| 조건                        | 렌더링                                       |
| --------------------------- | -------------------------------------------- |
| `params.userId === 세션 ID` | 프로필 수정 버튼, 저장한 여행지 목록 등 표시 |
| `params.userId !== 세션 ID` | 수정 버튼 숨김, 해당 유저의 공개 일정만 표시 |

---

### `/profile/[userId]/edit` — 프로필 수정 페이지

닉네임, 프로필 이미지 등을 수정하는 페이지. 로그인한 본인만 접근 가능하며, Middleware 또는 페이지 내부에서 인증 여부를 확인한다.

```tsx
// app/profile/[userId]/edit/page.tsx
export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  // 본인 여부 확인 후 접근 제어
}
```

---

### `/test` — 성향 테스트 질문 페이지

여행 성향 테스트의 질문 스텝을 처리하는 페이지.

- 질문 진행 상태는 Zustand 스토어 또는 URL 쿼리 파라미터로 관리
- 테스트 완료 시 `/test/result`로 이동

---

### `/test/result` — 테스트 결과 페이지

성향 테스트 결과를 표시하는 페이지. 결과 표현 방식은 두 가지 중 선택한다.

| 방식          | URL 예시                  | 적합한 경우                                           |
| ------------- | ------------------------- | ----------------------------------------------------- |
| 쿼리 파라미터 | `/test/result?type=ENFP`  | 공유 기능 없이 단순 표시                              |
| 동적 라우팅   | `/test/result/[resultId]` | 결과를 DB에 저장하고 친구에게 공유하는 기능이 있을 때 |

> 결과 공유 기능이 기획에 포함되어 있다면 **동적 라우팅 방식을 권장한다.**

---

### `/dev` — 개발용 UI 플레이그라운드

공통 컴포넌트의 variant, size, state를 확인하는 개발 전용 페이지. 실제 사용자 플로우에 포함되지 않으며 API 연동이나 비즈니스 로직을 두지 않는다.

- 프로덕션 배포 시 접근 제한 또는 제거 필요

---

## 구현 시 주의사항

### `routes.ts` 현재 상태

라우팅 상수 파일은 이미 제안 구조와 일치하게 구현되어 있다.

```ts
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
  DETAIL: (id: string) => `/detail/${id}`,
  PROFILE: (userId: string) => `/profile/${userId}`,
  PROFILE_EDIT: (userId: string) => `/profile/${userId}/edit`,
  TEST: '/test',
  TEST_RESULT: '/test/result',
} as const
```

### Next.js 15: `params`와 `searchParams`는 Promise

Next.js 15부터 동적 라우트의 `params`와 `searchParams`가 모두 `Promise` 타입으로 변경되었다. 반드시 `await`로 언래핑한다.

```tsx
// 올바른 사용법
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page } = await searchParams
}
```

### Middleware 파일 위치

`middleware.ts`는 반드시 `src/` 폴더 바로 아래에 위치해야 Next.js가 인식한다.

```
src/
├── middleware.ts   ← 여기
└── app/
```
