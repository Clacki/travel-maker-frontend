# Project Structure Guide

이 문서는 TravelMaker 프론트엔드의 폴더 구조와 파일 위치 기준을 정리한다. 리팩토링 지시서가 아니라, 새 페이지, feature, API, 타입, mock, 공통 컴포넌트를 어디에 추가할지 빠르게 판단하기 위한 작업 기준 문서다.

스타일 작성 기준은 `docs/design-system.md`를 따른다. 라우트 흐름과 URL 정책은 기존 `docs/ROUTING.md`를 함께 참고한다.

## 1. 적용 범위

- 이 문서는 폴더 구조와 파일 위치 기준을 설명한다.
- 현재 코드베이스의 구조를 기준으로 하며, 기존 구조를 갈아엎는 것을 목표로 하지 않는다.
- 확정되지 않은 구조는 규칙처럼 쓰지 않고 "팀 합의 필요"로 표시한다.
- 코드 스타일, Panda CSS 토큰, UI 스타일링 세부 기준은 `docs/design-system.md`를 우선한다.
- Swagger 명세 자체는 API 기준이고, 이 문서는 API 파일 위치와 타입 관리 기준을 설명한다.

## 2. 전체 폴더 역할

| 폴더                                  | 현재 역할                             | 기준                                                                                                                                               |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app`                             | Next.js App Router 진입점             | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, route entry를 둔다. 실제 UI와 상태 로직은 가능한 `src/features`로 위임한다. |
| `src/features`                        | 도메인별 실제 구현                    | `auth`, `explore`, `home`, `mypage`, `result`, `test`, `travel`, `trips`처럼 기능 단위 구현을 둔다.                                                |
| `src/components`                      | 도메인에 묶이지 않는 공통 UI          | `common`, `ui`, `layout`처럼 여러 feature에서 실제 재사용되는 컴포넌트를 둔다.                                                                     |
| `src/lib`                             | 공통 인프라와 유틸                    | axios instance, auth helper, token helper, 순수 유틸처럼 feature를 넘나드는 기반 코드를 둔다.                                                      |
| `src/services`                        | 현재 역할이 다소 애매한 영역          | 신규 API 함수는 우선 `features/{domain}/api`에 작성한다. `services` 확장은 팀 합의 후 진행한다.                                                    |
| `src/types`                           | 전역 공용 타입                        | 여러 feature에서 공유하는 타입만 둔다. feature 전용 타입은 feature 내부로 둔다.                                                                    |
| `src/mocks`                           | 전역 mock 데이터                      | 여러 feature에서 공유하거나 앱 전체 mock 기준이 되는 데이터를 둔다.                                                                                |
| `src/constants`                       | 전역 상수                             | route 상수, 앱 전역 옵션, 여러 feature가 공유하는 상수를 둔다.                                                                                     |
| `src/store`                           | feature를 넘어 공유되는 Zustand store | 여러 화면에서 함께 쓰는 상태만 둔다. feature 내부 상태는 component state, hook, feature-local store를 우선한다.                                    |
| `src/styles`                          | 전역 CSS                              | Panda layer, reset, body 기본값 등 전역 스타일만 둔다.                                                                                             |
| `src/assets`, `src/data`, `src/utils` | 보조 리소스와 유틸                    | 사용 범위가 전역인지 feature 전용인지 먼저 확인하고 추가한다. feature 전용이면 feature 내부 위치를 우선한다.                                       |

## 3. `src/app` 기준

`src/app`은 Next.js App Router의 진입점이다. 페이지 파일은 가능한 얇게 유지한다.

주요 파일 역할:

- `layout.tsx`: 공통 레이아웃, provider, shell 배치
- `page.tsx`: route의 진입점
- `loading.tsx`: 해당 route segment의 로딩 UI
- `error.tsx`: 해당 route segment의 에러 UI
- `not-found.tsx`: not found UI

권장 기준:

- `page.tsx`는 route parameter, search parameter, metadata, feature 컴포넌트 연결 정도만 담당한다.
- 복잡한 API 호출, 상태 관리, 이벤트 핸들러, 긴 JSX는 `src/features/{domain}`로 위임한다.
- `page.tsx`에 UI 블록을 직접 만들기 시작했다면 먼저 feature 컴포넌트로 분리할 수 있는지 확인한다.
- Next.js 버전별 App Router API 변경 가능성이 있으므로, routing API를 크게 바꾸기 전에는 `node_modules/next/dist/docs/`의 현재 버전 문서를 확인한다.

현재 예외:

- `src/app/(pages)/test/_components`
- `src/app/(pages)/test/result/_components`

위 구조는 현재 존재하는 예외다. 계속 허용할지, `src/features/test` 또는 `src/features/result`로 옮길지는 팀 합의가 필요하다. 새 페이지에서는 기본적으로 `app` 내부 `_components`보다 feature 내부 컴포넌트를 우선 검토한다.

## 4. `src/features` 기준

`src/features`는 도메인별 실제 구현 위치다.

현재 주요 feature:

- `auth`: 인증 API, auth store, auth hook, 로그인 상태 초기화
- `explore`: 여행지 탐색 화면, 필터, 장소 조회 API
- `home`: 홈 화면 도메인
- `mypage`: 마이페이지, 프로필, 북마크, 내 리뷰, 성향 테스트 결과
- `result`: 테스트 결과 관련 계산/타입/API
- `test`: 성향 테스트 질문/타입
- `travel`: 여행지 상세
- `trips`: 여행코스 목록, 상세, 생성, 수정, 지도/일정 패널

feature 내부 권장 구조:

```txt
src/features/{feature}/
  api/          # 해당 feature API 함수
  components/   # 해당 feature 전용 UI 컴포넌트
  types/        # 해당 feature 전용 타입
  hooks/        # 해당 feature 전용 상태/비즈니스 로직
  lib/          # 해당 feature 내부 유틸, adapter, normalizer
  data/         # 해당 feature 전용 mock 또는 정적 데이터
```

처음부터 모든 폴더를 만들 필요는 없다. 필요한 시점에 작게 추가한다.

feature 전용 컴포넌트는 가능한 feature 내부에 둔다. 공통으로 보일 수 있어도 실제 재사용처가 없거나 도메인 데이터에 강하게 묶여 있으면 common으로 올리지 않는다.

## 5. `src/components` 기준

`src/components`는 도메인에 의존하지 않는 공통 UI 위치다.

현재 구분:

- `components/layout`: `Header`, `Footer`, `PageLayout` 등 앱 레이아웃
- `components/common`: Button, Modal, Status, ReviewModal, WithdrawModal, tag 등 공통 성격의 컴포넌트
- `components/ui`: `PlaceCard`, `Pagination`처럼 UI 재사용 단위
- `components/filters`, `components/auth`: 현재 공통과 feature 사이 성격이 섞일 수 있는 영역

common으로 올려도 되는 조건:

- 특정 도메인 데이터에 의존하지 않는다.
- 2곳 이상에서 실제로 재사용된다.
- props로 충분히 제어 가능하다.
- 디자인 시스템 기준을 따르는 공통 UI다.

common으로 올리면 안 되는 조건:

- 리뷰, 여행지, 코스, 성향 결과처럼 도메인 개념이 강하다.
- 특정 API 응답 구조에 직접 의존한다.
- 특정 페이지에서만 사용한다.
- 재사용 가능성만 추측되고 실제 사용처가 없다.

공통 후보를 만들 때는 먼저 feature 내부에서 안정화하고, 두 번째 실제 사용처가 생길 때 공통화하는 방식을 권장한다.

## 6. API 함수와 타입 위치

feature 전용 API 함수는 `src/features/{domain}/api`에 둔다.

예시:

- `src/features/auth/api/authApi.ts`
- `src/features/mypage/api/myReviewsApi.ts`
- `src/features/explore/api/placesApi.ts`
- `src/features/trips/api/routesApi.ts`
- `src/features/travel/detail/api/reviewApi.ts`

공통 인프라는 `src/lib`에 둔다.

- axios instance: `src/lib/api.ts`
- auth/token helper: `src/lib/auth.ts`, feature auth utils
- 순수 공통 유틸: `src/lib` 또는 기존 전역 유틸 위치

타입 기준:

- request/response 타입은 API 함수 근처 또는 feature `types`에 둔다.
- API response 타입과 UI view model 타입은 이름으로 구분한다.
- adapter/normalizer가 필요하면 feature `lib` 또는 API 파일 근처에 둔다.
- Swagger 변경으로 API 타입이 바뀌면 mock 데이터도 함께 수정한다.

주의:

- `NEXT_PUBLIC_API_URL`에 `/api/v1`이 포함될 수 있으므로 API 함수에서 `/api/v1`을 중복으로 붙이지 않는다.
- `src/lib/api.ts` 변경은 인증, interceptor, 전역 네트워크 동작에 영향을 줄 수 있으므로 단독 PR을 권장한다.

## 7. mock/data 위치

전역 mock과 feature mock을 구분한다.

- 여러 feature에서 공유하는 mock: `src/mocks`
- 특정 feature에서만 쓰는 mock 또는 정적 데이터: `src/features/{domain}/data`
- feature 내부 UI 개발용 데이터: feature `data` 또는 해당 컴포넌트 근처에서 시작하고, 커지면 `data`로 분리한다.

현재 `src/mocks/data`와 `features/*/data`가 함께 존재한다. 당장 하나로 통일하기보다, 새 데이터 추가 시 사용 범위를 먼저 확인한다.

규칙:

- API 타입이 바뀌면 mock 데이터도 함께 수정한다.
- mock이 실제 API response 형태와 멀어지면 adapter 테스트와 typecheck 실패 가능성이 커진다.
- 여러 feature에서 공유하지 않는 mock을 `src/mocks`에 먼저 올리지 않는다.

팀 합의 필요:

- `src/mocks/data`로 통일할지, feature별 `data`를 계속 허용할지
- MSW handler와 정적 mock 데이터의 경계

## 8. `src/types` 기준

`src/types`에는 전역 공용 타입만 둔다.

전역 타입 예시:

- 여러 feature에서 공유하는 여행지/코스 기본 타입
- 앱 전역에서 쓰는 공통 응답 타입
- 전역 UI 또는 route에서 공유하는 타입

feature 전용 타입은 `src/features/{domain}/types` 또는 API 파일 근처에 둔다. 전역 타입과 feature 타입이 중복되지 않도록, 타입을 올리기 전에 실제 사용처가 2곳 이상인지 확인한다.

## 9. `src/lib`와 `src/services` 기준

`src/lib`는 공통 인프라와 유틸 위치다.

둘 수 있는 것:

- axios instance
- interceptor
- auth helper
- token helper
- feature에 묶이지 않는 pure utility

`src/services`는 현재 역할이 다소 애매하다. 신규 API 함수는 우선 `src/features/{domain}/api`에 작성한다. `services`를 계속 사용할지, `lib` 또는 `features/*/api`로 흡수할지는 팀 합의 후 진행한다.

## 10. `src/store` 기준

`src/store`는 feature를 넘어 공유되는 Zustand store 위치다.

현재 예시:

- `tripsStore.ts`
- `quizStore.ts`
- `profileStore.ts`

기준:

- 여러 화면에서 공유되는 상태라면 `src/store`를 검토한다.
- 특정 feature 안에서만 쓰는 상태는 component state, feature hook, feature-local store를 우선한다.
- 전역 store 추가 전에는 실제 공유 범위와 persist 필요 여부를 확인한다.
- API cache 성격의 상태를 store에 넣기 전에는 fetch 구조와 invalidation 방식을 먼저 정한다.

## 11. 새 페이지 추가 절차

1. `src/app/(pages)/.../page.tsx`를 만든다.
2. 실제 화면 구현은 `src/features/{domain}`에 작성한다.
3. 필요한 경우 `src/constants/routes.ts`에 route 상수를 추가한다.
4. API가 필요하면 `src/features/{domain}/api`에 API 함수를 추가한다.
5. 타입이 필요하면 feature `types` 또는 API 파일 근처에 추가한다.
6. mock이 필요하면 feature `data` 또는 `src/mocks` 기준에 맞게 추가한다.
7. 스타일은 `docs/design-system.md`의 Panda CSS 기준을 따른다.

`page.tsx` 체크:

- route 연결만 담당하는가?
- 실제 UI가 feature로 위임되어 있는가?
- API 요청, 상태 관리, 긴 조건부 렌더링이 들어가지 않았는가?

## 12. 새 feature 추가 절차

새로운 도메인 단위 기능이면 `src/features/{feature}`를 만든다.

필요한 폴더만 점진적으로 추가한다.

```txt
components/
api/
types/
hooks/
lib/
data/
```

feature 내부 파일이 커지면 역할 기준으로 나눈다.

- UI 블록: `components`
- 상태/비즈니스 로직: `hooks`
- API response 가공: `lib` 또는 API 파일 근처
- 타입: `types` 또는 API 파일 근처
- 정적 데이터/mock: `data`

## 13. 무거운 컴포넌트 분리 기준

아래 조건에 해당하면 분리 후보로 본다.

- API 요청, 상태 관리, 이벤트 핸들러, 조건부 렌더링, UI 마크업이 한 파일에 몰려 있다.
- 탭, 모달, 폼, 리스트, 필터, 페이지네이션 로직이 한 컴포넌트에 모여 있다.
- 여러 명이 동시에 수정할 가능성이 높아 충돌 위험이 크다.
- 특정 UI 블록을 feature 내부 component로 분리할 수 있다.
- 상태/비즈니스 로직을 hook으로 분리할 수 있다.
- constants/types로 분리할 값이 컴포넌트 안에 직접 작성되어 있다.

단순히 줄 수가 길다는 이유만으로 분리하지 않는다. 책임이 섞여 있거나 리뷰, 테스트, 수정이 어려운지를 기준으로 판단한다.

현재 충돌 위험이 높은 파일 예시:

| 파일                                                             | 현재 문제                                                                  | 분리 추천 단위                                              | 우선순위 | 진행 방식                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- | -------------------------- |
| `src/features/mypage/components/MyPageContent/MyPageContent.tsx` | 프로필, 북마크, 리뷰 CRUD, 탭, 모달, 성향 결과 상태가 한 파일에 모여 있다. | 탭별 panel, 리뷰 hook, 북마크 hook, mock/adapters 분리      | 높음     | 팀 합의 후 작은 PR로 진행  |
| `src/features/explore/ExplorePage.tsx`                           | URL query, 필터, API fetch, 좋아요 처리, hero, 리스트 UI가 함께 있다.      | filter/query hook, place fetch hook, hero/list section 분리 | 높음     | 기능 PR과 분리 권장        |
| `src/features/trips/CourseMapPanel/CourseMapPanel.tsx`           | 카카오맵 SDK 로딩, marker DOM 조작, route 생성/수정 API, UI가 함께 있다.   | map SDK hook, marker/overlay helper, submit 로직 분리       | 높음     | 지도 동작 회귀 테스트 필요 |
| `src/constants/routes.ts`                                        | 여러 작업에서 동시에 수정될 가능성이 높다.                                 | route 추가만 작게 유지                                      | 중간     | route 변경 PR 범위 최소화  |
| `src/lib/api.ts`                                                 | 인증/interceptor/전역 baseURL 영향이 크다.                                 | 변경 시 인증 영향 명시                                      | 높음     | 단독 PR 권장               |
| `src/components/layout/Header.tsx`                               | 인증, navigation, profile dropdown 등 여러 기능이 모이기 쉽다.             | dropdown, mobile nav, auth 표시 분리                        | 중간     | UI 변경과 인증 변경 분리   |

## 14. 스타일 기준 연결

Panda CSS 작성 기준은 `docs/design-system.md`를 따른다.

큰 컴포넌트에서 스타일이 길어졌다면 바로 `*.styles.ts`를 만들지 않는다.

1. UI 블록을 작은 컴포넌트로 분리한다.
2. 상태 관리, API 요청, 이벤트 핸들러를 hook 또는 feature-local 로직으로 분리한다.
3. 반복 스타일은 공통 컴포넌트, `cva`, recipe 사용을 검토한다.
4. 그래도 스타일 정의가 과도하게 길면 `*.styles.ts` 분리를 검토한다.

스타일 상세 규칙은 이 문서에 길게 중복하지 않고 `docs/design-system.md`로 안내한다.

## 15. 충돌을 줄이는 PR 단위

권장:

- API 타입 변경과 UI 대규모 변경은 가능하면 분리한다.
- route 상수 변경은 작게 유지한다.
- `src/lib/api.ts` 변경은 인증/전역 네트워크 영향이 커서 단독 PR을 권장한다.
- mock 데이터 구조 변경은 해당 API 타입 변경과 함께 처리한다.
- 큰 컴포넌트에 기능을 추가하기 전, 리스트/모달/hook 분리 여부를 먼저 검토한다.
- 스타일 대규모 정리는 기능 구현 PR과 분리한다.

같이 묶으면 위험한 작업:

- 인증 interceptor 변경 + 여러 feature API 변경
- route 구조 변경 + Header navigation 변경 + page 이동
- mock 구조 변경 + UI 대규모 리디자인
- 마이페이지 탭 추가 + 리뷰 CRUD 수정 + 프로필 수정 로직 변경
- 지도 SDK 로직 변경 + 코스 저장 API 변경

## 16. 예외와 팀 합의 필요 항목

아래 항목은 이 문서에서 확정 규칙으로 정하지 않는다. 팀 합의 후 업데이트한다.

- `src/app/(pages)/test/_components` 허용 여부
- mock 위치를 `src/mocks/data`로 통일할지, feature별 `data`를 허용할지
- API 타입을 `api/*.ts`에 둘지, `types/*.ts`로 분리할지
- `src/services`를 유지할지, `src/lib` 또는 `features/*/api`로 흡수할지
- 도메인성이 있는 `components/ui` 컴포넌트 기준
- `page.tsx`에서 허용하는 책임 범위
- `package.json`에 `typecheck` script를 추가할지

## 17. 작업 전 체크리스트

- `page.tsx`가 얇게 유지되는가?
- 실제 UI가 feature로 위임되어 있는가?
- feature 전용 타입과 컴포넌트를 feature 내부에 두었는가?
- 공통 컴포넌트가 특정 도메인에 의존하지 않는가?
- API 타입 변경 시 mock도 함께 수정했는가?
- 큰 컴포넌트에 API, 상태, UI가 모두 얹히지 않았는가?
- route 상수 변경 범위가 작고 명확한가?
- 전역 store가 정말 여러 화면에서 공유되는 상태인가?
- 스타일 기준은 `docs/design-system.md`를 따랐는가?
