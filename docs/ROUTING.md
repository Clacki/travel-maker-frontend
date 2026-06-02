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
    │
    ├── explore/
    │   └── page.tsx                # 탐색 페이지 (/explore)
    │
    ├── detail/
    │   └── [id]/
    │       └── page.tsx            # 여행지 상세 페이지 (/detail/123)
    │
    ├── profile/
    │   ├── [userId]/
    │   │   └── page.tsx            # 프로필 페이지 (/profile/user123)
    │   └── edit/
    │       └── page.tsx            # 프로필 수정 페이지 (/profile/edit)
    │
    ├── test/
    │   ├── page.tsx                # 성향 테스트 질문 페이지 (/test)
    │   └── result/
    │       └── page.tsx            # 테스트 결과 페이지 (/test/result)
    │
    └── (auth)/
        └── login/
            └── page.tsx            # 소셜 로그인 페이지 (/login)
```

---

## 페이지별 상세 설명

### `layout.tsx` — 공통 레이아웃

모든 페이지에서 공유하는 최상위 레이아웃. `<Header />`와 `<Footer />`를 여기에 배치하면 페이지 이동 시 헤더/푸터는 리렌더링되지 않고 `children`(내부 콘텐츠)만 교체된다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
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
  searchParams: { page?: string; region?: string; theme?: string }
}) {
  const page = Number(searchParams.page) || 1

  // page 값으로 서버에서 해당 페이지 데이터 페칭
}
```

- `page` 파라미터가 없으면 기본값 1로 처리
- 필터(지역, 테마 등)도 동일한 쿼리 파라미터로 관리하여 필터 변경 시 `page=1`로 초기화

> **⚠️ 현재 레포의 `/travel`과 동일한 역할이다.** 팀 합의 후 이름을 통일할 것.

---

### `/detail/[id]` — 여행지 상세 페이지

동적 라우팅(Dynamic Routes)으로 여행지 ID에 따라 개별 상세 정보를 표시한다.

```
/detail/123   → id = "123"
/detail/seoul → id = "seoul"
```

**비로그인 유저 접근 처리 (Middleware 방식 권장)**

`middleware.ts`에서 비로그인 유저의 `/detail/*` 접근을 가로채고, `?showLogin=true`를 붙여 직전 페이지(또는 메인 페이지)로 리다이렉트한다.

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = !!request.cookies.get('session')
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
export default function ProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  const { userId } = params
  const { data: session } = useSession()

  const isMyProfile = session?.user?.id === userId

  return isMyProfile ? <MyProfile /> : <OtherProfile userId={userId} />
}
```

| 조건                        | 렌더링                                       |
| --------------------------- | -------------------------------------------- |
| `params.userId === 세션 ID` | 프로필 수정 버튼, 저장한 여행지 목록 등 표시 |
| `params.userId !== 세션 ID` | 수정 버튼 숨김, 해당 유저의 공개 일정만 표시 |

> **⚠️ 현재 레포의 `/mypage`는 이 구조로 교체되어야 한다.**

---

### `/profile/edit` — 프로필 수정 페이지

닉네임, 프로필 이미지 등을 수정하는 페이지. 로그인한 본인만 접근 가능하며, Middleware 또는 페이지 내부에서 인증 여부를 확인한다.

---

### `/test` — 성향 테스트 질문 페이지

여행 성향 테스트의 질문 스텝을 처리하는 페이지.

- 질문 진행 상태는 Zustand 스토어 또는 URL 쿼리 파라미터로 관리
- 테스트 완료 시 `/test/result`로 이동

> **⚠️ 현재 레포에는 이 페이지가 없다.** 결과 페이지(`/result`)만 존재하므로 진입 페이지 생성 필요.

---

### `/test/result` — 테스트 결과 페이지

성향 테스트 결과를 표시하는 페이지. 결과 표현 방식은 두 가지 중 선택한다.

| 방식          | URL 예시                  | 적합한 경우                                           |
| ------------- | ------------------------- | ----------------------------------------------------- |
| 쿼리 파라미터 | `/test/result?type=ENFP`  | 공유 기능 없이 단순 표시                              |
| 동적 라우팅   | `/test/result/[resultId]` | 결과를 DB에 저장하고 친구에게 공유하는 기능이 있을 때 |

> 결과 공유 기능이 기획에 포함되어 있다면 **동적 라우팅 방식을 권장한다.**

---

### `(auth)/login` — 소셜 로그인 페이지

소셜 로그인(카카오, 네이버, 구글 등)을 처리하는 페이지. `(auth)`는 Route Group으로, URL에는 포함되지 않는다.

```
실제 접근 URL: /login
```

**로그인 후 리다이렉트 경로 결정 필요**

| 시나리오                        | 리다이렉트 대상                   |
| ------------------------------- | --------------------------------- |
| 상세 페이지 진입 시도 후 로그인 | 원래 보려던 `/detail/[id]`로 복귀 |
| 일반 로그인                     | 메인 페이지(`/`)                  |

→ 카카오/네이버/구글 OAuth의 **Redirect URI** 설계와 연결되므로 백엔드팀과 사전 합의 필요.

---

## 현재 레포와의 차이점

| 제안 구조                    | 현재 레포    | 상태           | 조치 필요                     |
| ---------------------------- | ------------ | -------------- | ----------------------------- |
| `/explore`                   | `/travel`    | ⚠️ 이름 불일치 | 팀 합의 후 통일               |
| `/detail/[id]`               | 없음         | ❌ 미구현      | 폴더 및 페이지 신규 생성      |
| `/profile/[userId]`          | `/mypage`    | ⚠️ 구조 상이   | 동적 라우팅으로 교체          |
| `/profile/edit`              | 없음         | ❌ 미구현      | 신규 생성                     |
| `/test`                      | 없음         | ❌ 미구현      | 질문 페이지 신규 생성         |
| `/test/result`               | `/result`    | ⚠️ 경로 불일치 | 경로 이동 및 `routes.ts` 수정 |
| `layout.tsx` (Header/Footer) | ✅ 구현 완료 | ✅             | 없음                          |
| `(auth)/login`               | `/login`     | ✅ 경로 동일   | Route Group 적용 여부만 결정  |

---

## 구현 시 주의사항

### `routes.ts` 업데이트

라우팅 구조 변경에 맞춰 상수 파일도 함께 수정한다.

```ts
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
  DETAIL: (id: string) => `/detail/${id}`,
  PROFILE: (userId: string) => `/profile/${userId}`,
  PROFILE_EDIT: '/profile/edit',
  TEST: '/test',
  TEST_RESULT: '/test/result',
} as const
```

### Middleware 파일 위치

`middleware.ts`는 반드시 `src/` 폴더 바로 아래(또는 프로젝트 루트)에 위치해야 Next.js가 인식한다.

```
src/
├── middleware.ts   ← 여기
└── app/
```

### 확장 고려

추후 리뷰/피드 기능이 추가될 경우 아래와 같이 폴더를 확장할 수 있다.

```
app/detail/[id]/
├── page.tsx
└── reviews/        ← 추후 추가 가능
    └── page.tsx
```
