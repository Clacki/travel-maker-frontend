# Kakao Login and Auth Flow

이 문서는 현재 코드 기준의 로그인 흐름을 정리한다. 이상적인 구조가 아니라, 2026-06-10 현재 프론트엔드에 구현된 동작과 디버깅 포인트를 기준으로 한다.

## 1. 현재 로그인 구조 요약

### 코드에서 확인된 구조

- 카카오 로그인 시작은 `LoginModal`의 버튼 클릭에서 시작된다.
- `src/services/auth.ts`의 `redirectToKakaoLogin()`이 `window.location.href`를 카카오 authorize URL로 변경한다.
- authorize URL은 아래 값으로 만든다.
  - base URL: `https://kauth.kakao.com/oauth/authorize`
  - `client_id`: `NEXT_PUBLIC_KAKAO_CLIENT_ID`
  - `redirect_uri`: `NEXT_PUBLIC_KAKAO_REDIRECT_URI`
  - `response_type`: `code`
- `.env.example`의 `NEXT_PUBLIC_KAKAO_REDIRECT_URI`는 프론트 route가 아니라 백엔드 콜백 API인 `https://api.travel-maker.site/api/v1/auth/kakao/callback`을 가리킨다.
- 따라서 현재 구조는 프론트가 Kakao authorize URL로 보내고, Kakao가 백엔드 콜백 API로 `code`를 전달하는 백엔드 주도 OAuth 흐름이다.

### 코드상 추정되는 백엔드 콜백 역할

프론트 코드에는 백엔드 콜백 API 구현이 없다. 다만 현재 프론트 콜백 처리 코드를 보면 백엔드는 다음 역할을 하는 것으로 보인다.

- Kakao authorization code를 받아 백엔드에서 Kakao 토큰 교환 및 사용자 로그인/가입 처리
- 성공 시 프론트를 `/auth/callback?access_token=...&is_new_user=...` 형태로 redirect
- 실패 시 프론트를 `/auth/callback?error=auth_failed` 또는 `error` query가 있는 형태로 redirect
- refresh token은 HttpOnly Cookie로 내려주는 것으로 전제됨

## 2. 로그인 성공 이후 프론트 처리 흐름

### `/auth/callback`

- route: `src/app/auth/callback/page.tsx`
- 실제 로직: `src/app/auth/callback/AuthCallbackClient.tsx`
- `Suspense` fallback으로 로그인 처리 중 메시지를 보여주고, client component에서 query parameter를 읽는다.

`AuthCallbackClient`가 읽는 query parameter:

- `access_token`
- `accessToken`
- `is_new_user`
- `error`

처리 흐름:

1. `error`가 있거나 `access_token`/`accessToken`이 없으면 `clearAuth()`와 `clearUserProfile()`을 호출하고 error 상태를 보여준다.
2. access token이 있으면 `useAuthStore.setAccessToken(accessToken)`을 호출한다.
3. 그 다음 `loadCurrentUserProfile()`로 `/users`를 호출해 현재 사용자 프로필을 가져온다.
4. 프로필 조회가 실패해도 로그인 자체는 유지하고 `clearUserProfile()`만 실행한다.
5. `is_new_user` 값에 따라 성공 메시지를 다르게 설정하지만, 현재 코드상 최종 이동은 신규/기존 모두 `router.replace(ROUTES.HOME)`이다.

주의:

- `AuthCallbackClient`는 중복 실행 방지를 위해 `hasRequestedRef`를 사용한다.
- callback route에서는 `AuthInitializer`가 refresh 초기화를 건너뛰고 `isAuthInitialized`만 true로 둔다. 실제 callback 처리는 `AuthCallbackClient`가 담당한다.

## 3. 토큰 관리 방식

### access token

현재 활성 access token은 Zustand store인 `useAuthStore.accessToken`에 저장된다.

- 저장: `useAuthStore.setAccessToken(accessToken)`
- 로그인 상태: `isLoggedIn: true`
- 초기화 완료 상태: `isAuthInitialized: true`
- API 요청 시 `src/lib/api.ts` interceptor가 store의 access token을 읽어 `Authorization: Bearer <token>`을 붙인다.

현재 코드는 access token을 localStorage에 저장하지 않는다. `src/features/auth/utils/tokenStorage.ts`의 `ACCESS_TOKEN_STORAGE_KEY = 'accessToken'`은 legacy key로 취급되며, 로그인/로그아웃/초기화 시 `clearLegacyStoredAccessToken()`으로 삭제된다.

### refresh token

프론트 코드상 refresh token은 직접 읽거나 저장하지 않는다. 서버 컴포넌트에서 로그인 여부를 확인하는 `src/lib/auth.ts`는 `cookies()`에서 `refresh_token` 쿠키 존재 여부만 확인한다.

정리:

- refresh token은 HttpOnly Cookie로 관리되는 것으로 전제된다.
- 프론트 JavaScript에서는 HttpOnly Cookie 값을 읽을 수 없다.
- `src/lib/api.ts`는 `withCredentials: true`를 설정해 refresh API, logout API 등 credential이 필요한 요청에 쿠키가 함께 전송되도록 한다.

### refresh API

- API 함수: `refreshAccessToken()`
- endpoint: `POST /auth/token/refresh`
- response shape: `{ access_token: string }`
- 사용처: `useInitializeAuth()`

새로고침이나 직접 URL 진입처럼 Zustand store가 비어 있는 상황에서는 refresh API로 access token을 다시 발급받고 store를 복구한다.

### localStorage 역할

현재 localStorage는 토큰 저장소가 아니다.

- `authLoggedOut`: 사용자가 명시적으로 로그아웃했음을 표시한다.
- `accessToken`: legacy key이며 현재 코드는 삭제한다.

로그아웃 시 `markAuthLoggedOut()`이 localStorage에 `authLoggedOut=true`를 저장한다. 이후 `useInitializeAuth()`는 이 값이 있으면 refresh 요청을 하지 않고 초기화 완료로 처리한다.

## 4. 로그인 상태 초기화 및 복구 흐름

### AuthInitializer

- 위치: `src/features/auth/components/AuthInitializer.tsx`
- root layout: `src/app/layout.tsx`
- 내부 hook: `useInitializeAuth()`

`useInitializeAuth()` 흐름:

1. 첫 실행인지 `hasInitializedRef`로 확인한다.
2. legacy localStorage access token을 삭제한다.
3. store의 `isAuthInitialized`가 이미 true면 종료한다.
4. 현재 pathname이 `/auth/callback` 또는 `/social-callback`이면 refresh를 하지 않고 `isAuthInitialized=true`로 둔다.
5. `authLoggedOut=true`이면 refresh를 하지 않고 `isAuthInitialized=true`로 둔다.
6. 그 외에는 `refreshAccessToken()`을 호출한다.
7. refresh 성공 시 access token을 store에 저장하고 `loadCurrentUserProfile()`을 호출한다.
8. refresh 실패 시 `clearAuth()`와 `clearUserProfile()`을 호출한다.
9. finally에서 `setAuthInitialized(true)`를 호출한다.

### 초기화 완료 상태

`useAuthStore`에는 `isAuthInitialized`가 있다. 이 값은 “로그인인지 아닌지 판단이 끝났다”는 신호다.

중요한 규칙:

- `isAuthInitialized === false`일 때 `isLoggedIn === false`라고 해서 비로그인으로 확정하면 안 된다.
- Header, profile page guard처럼 로그인 상태를 쓰는 UI는 초기화 전 상태를 별도로 처리해야 한다.

현재 적용된 처리:

- Header는 auth 초기화 중에 skeleton 대신 disabled 로그인 버튼을 보여준다.
- 마이페이지와 프로필 수정 페이지는 auth 초기화 중에는 `LoadingState`를 보여주고 redirect하지 않는다.
- 초기화가 끝난 뒤 `isLoggedIn === false`일 때만 `router.replace('/?showLogin=true')`를 실행한다.

### 서버 컴포넌트의 로그인 판단

`src/lib/auth.ts`의 `isAuthenticated()`는 서버에서 `refresh_token` 쿠키 존재 여부만 확인한다. 다음 페이지가 이 값을 사용한다.

- `src/app/(pages)/detail/[id]/page.tsx`
- `src/app/(pages)/explore/page.tsx`
- `src/app/(pages)/test/result/_components/ResultPage.tsx`

이 값은 클라이언트 store의 `accessToken`이나 `isLoggedIn`을 볼 수 없다. 서버 컴포넌트와 middleware/proxy에서는 localStorage도 볼 수 없다.

## 5. 최근 수정된 문제와 원인

### Header pending UI

기존 문제:

- auth 초기화 중 Header 액션 영역이 비어 보이거나 skeleton처럼 보였다.

현재 처리:

- `isAuthInitialized === false`이면 실제 로그인 버튼과 같은 형태의 UI를 보여준다.
- desktop은 `<Button disabled aria-busy="true">로그인</Button>` 형태다.
- mobile은 같은 의미의 disabled `IconButton`을 보여준다.
- 클릭은 막히고 레이아웃 흔들림은 줄어든다.

### 마이페이지/프로필 수정 페이지 redirect 타이밍

기존 문제:

- 로그인 상태 복구가 끝나기 전에 비로그인으로 판단하면 `/profile/2` 진입이 `/?showLogin=true`로 튕길 수 있었다.

현재 처리:

- `MyPageContent`와 `ProfileEditContent`는 `isAuthInitialized`가 false이면 redirect하지 않는다.
- 초기화 완료 후 `isLoggedIn`이 false인 경우에만 `router.replace('/?showLogin=true')`를 실행한다.

### middleware/proxy 주의

현재 `src/middleware.ts`는 존재하지 않는다.

이전처럼 middleware가 `/profile/:path*`에서 `refresh_token` 쿠키만 보고 redirect하면 다음 문제가 생길 수 있다.

- 서버가 볼 수 있는 쿠키 상태와 클라이언트 store 상태가 어긋날 때 Header는 로그인처럼 보이는데 route는 홈으로 튕길 수 있다.
- 서버/middleware는 localStorage access token이나 Zustand store를 볼 수 없다.
- Next.js 16에서는 `middleware.ts`가 deprecated이며 `proxy.ts`로 변경되었다. 단, proxy를 쓰더라도 localStorage/store를 볼 수 없다는 제약은 동일하다.

## 6. 자주 발생할 수 있는 이슈

### “토큰이 유지되지 않는다”는 말의 의미를 먼저 구분하기

확인할 것:

- store의 `accessToken`이 비어 있는가?
- `authLoggedOut=true`가 localStorage에 남아 refresh를 막고 있는가?
- refresh token cookie가 브라우저에 있는가?
- `/auth/token/refresh` 요청이 성공하는가?
- `withCredentials: true`가 유지되고 있는가?

현재 구조에서는 새로고침 후 Zustand store가 비는 것이 정상이다. 이때 refresh API가 성공해 store가 복구되면 “토큰 유지 실패”가 아니다.

### localStorage의 `accessToken`

현재 구현에서 localStorage `accessToken`은 활성 토큰 저장소가 아니다. 남아 있다면 legacy 값일 가능성이 높고, 초기화/로그인/로그아웃 과정에서 삭제된다.

### 새로고침 후 잠깐 비로그인처럼 보이는 문제

새로고침 직후에는 store 기본값이 다음과 같다.

```ts
accessToken: null
isLoggedIn: false
isAuthInitialized: false
```

이 상태에서 바로 `if (!isLoggedIn) redirect`를 실행하면 실제로는 refresh 확인 중인데도 비로그인으로 처리된다. 보호 페이지에서는 반드시 `isAuthInitialized`를 먼저 확인해야 한다.

### `/auth/callback?error=auth_failed`

가능성이 있는 원인:

- Kakao Developers에 등록된 redirect URI가 `NEXT_PUBLIC_KAKAO_REDIRECT_URI`와 다름
- 백엔드 OAuth callback API가 Kakao code 처리에 실패
- 백엔드가 프론트 callback URL을 만들 때 사용하는 `FRONTEND_URL`이 잘못됨
- 프론트 callback route(`/auth/callback`)와 백엔드 callback API(`/auth/kakao/callback`)의 역할을 혼동함

역할 구분:

- Kakao Developers redirect URI: Kakao가 code를 보낼 백엔드 callback API
- `NEXT_PUBLIC_KAKAO_REDIRECT_URI`: 프론트가 Kakao authorize URL에 넣는 redirect URI이며 현재는 백엔드 callback API
- 백엔드 `FRONTEND_URL`: 백엔드가 로그인 처리 후 사용자를 돌려보낼 프론트 origin
- 프론트 `/auth/callback`: 백엔드가 넘긴 `access_token`, `is_new_user`, `error`를 처리하는 화면

## 7. 로그인 관련 작업 체크리스트

- 로그인 버튼 클릭 시 `redirectToKakaoLogin()`이 호출되는지 확인
- authorize URL에 `client_id`, `redirect_uri`, `response_type=code`가 들어가는지 확인
- Kakao Developers redirect URI와 `NEXT_PUBLIC_KAKAO_REDIRECT_URI`가 일치하는지 확인
- 백엔드가 성공 시 `/auth/callback?access_token=...` 형태로 redirect하는지 확인
- 로그인 성공 후 `useAuthStore.accessToken`이 채워지는지 확인
- 로그인 성공 후 `/users` 요청으로 `useUserProfileStore.userProfile`이 채워지는지 확인
- refresh token cookie가 브라우저에 설정되는지 확인
- axios instance의 `withCredentials: true`가 유지되는지 확인
- 새로고침 후 `/auth/token/refresh`가 호출되고 access token이 복구되는지 확인
- `authLoggedOut=true`가 남아 refresh를 막고 있지 않은지 확인
- 보호 페이지에서 `isAuthInitialized` 완료 전 redirect하지 않는지 확인
- 서버 컴포넌트, proxy, middleware 기준 로그인 판단과 클라이언트 store 기준 판단을 혼동하지 않는지 확인
- localStorage token 존재 여부와 Zustand store 로그인 상태를 분리해서 디버깅하기

## 개선 필요 사항

- `src/lib/auth.ts`는 `refresh_token` 쿠키 존재 여부만 확인한다. 실제 API 인증 상태와 다를 수 있으므로, 서버에서 더 강한 인증 검증이 필요하면 백엔드 세션 검증 API나 서버용 인증 helper를 별도로 설계해야 한다.
- profile guard 로직이 `MyPageContent`와 `ProfileEditContent`에 중복되어 있다. 보호 페이지가 늘어나면 공통 guard component 또는 hook으로 분리할 수 있다.
- `ProfileDropdown`은 `userProfile?.id ?? 'me'`를 사용한다. 현재 프로필 API 복구가 실패하면 `/profile/me`로 이동할 수 있으므로, 안정적인 current user id 확보 전략을 정할 필요가 있다.
- `AuthCallbackClient`는 `is_new_user`에 따라 메시지만 다르고 최종 이동은 모두 홈이다. 신규 유저 온보딩 경로가 생기면 여기서 분기해야 한다.
- Next.js 16 기준으로 middleware는 proxy로 변경되었다. 향후 서버 레벨 redirect가 필요하면 `src/proxy.ts` 사용 여부와 한계를 먼저 검토해야 한다.
