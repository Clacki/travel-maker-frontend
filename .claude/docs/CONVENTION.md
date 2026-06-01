# 컨벤션 가이드

## 브랜치 네이밍

```
<type>/<간단한-설명>
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
feat/login-page
fix/auth-token-expired
docs/add-convention
```

---

## Git 커밋 메시지

```
<type>: <설명> (#이슈번호)
```

- 타입은 소문자, 설명은 한국어 또는 영어
- 허용 타입: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `build`, `ci`, `perf`
- 이슈 번호는 관련 이슈가 있을 때만 포함

**예시**

```
feat: 로그인 기능 추가 (#12)
fix: 토큰 만료 오류 수정 (#15)
docs: CONVENTION.md 추가
chore: 패키지 버전 업데이트
```

> pre-commit 훅에서 형식 자동 검증됨 (`<type>: <설명>` 미준수 시 커밋 차단)

---

## Git 이슈

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

## Pull Request

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

## Next.js App Router — Server/Client Component

기본값은 **Server Component**. 아래 조건에 해당할 때만 `'use client'`를 추가한다.

| 상황                                               | 컴포넌트         |
| -------------------------------------------------- | ---------------- |
| 데이터 페칭, 서버 리소스 접근                      | Server Component |
| 순수 UI 렌더링 (props만 받는 경우)                 | Server Component |
| `useState`, `useEffect` 등 React 훅 사용           | Client Component |
| 이벤트 핸들러 (`onClick` 등) 사용                  | Client Component |
| 브라우저 API (`window`, `localStorage` 등) 사용    | Client Component |
| 외부 라이브러리가 브라우저 환경 요구 (Recharts 등) | Client Component |

**원칙: `'use client'` 경계는 가능한 한 leaf(말단) 컴포넌트까지 내린다.**

```
app/
└── dashboard/
    └── page.tsx          # Server Component (데이터 페칭)
        └── ChartSection.tsx  # Client Component ('use client')
```

---

## 파일 / 폴더 네이밍

| 대상                   | 형식                       | 예시                                 |
| ---------------------- | -------------------------- | ------------------------------------ |
| 컴포넌트 파일          | PascalCase                 | `LoginForm.tsx`, `UserCard.tsx`      |
| 컴포넌트 폴더          | PascalCase                 | `LoginForm/`, `UserCard/`            |
| 페이지 컴포넌트        | PascalCase + `Page` suffix | `LoginPage.tsx`, `DashboardPage.tsx` |
| 훅                     | camelCase + `use` prefix   | `useAuth.ts`, `useUserQuery.ts`      |
| 스토어                 | camelCase + `Store` suffix | `authStore.ts`, `uiStore.ts`         |
| 유틸 / 헬퍼            | camelCase                  | `formatDate.ts`, `validateEmail.ts`  |
| 상수                   | camelCase                  | `routes.ts`, `queryKeys.ts`          |
| 타입 / 인터페이스 파일 | camelCase                  | `user.types.ts`, `auth.types.ts`     |
| CSS / 스타일           | camelCase                  | `index.css`, `App.css`               |
| 일반 폴더              | kebab-case                 | `design-tokens/`, `api-clients/`     |

**컴포넌트 디렉토리 구조**

```
src/components/
└── ButtonGroup/
    ├── ButtonGroup.tsx   # 컴포넌트 본체
    └── index.ts          # barrel export
```
