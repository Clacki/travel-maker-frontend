# Claude 작업 규칙

- 작업 전에 `AGENTS.md`를 먼저 확인한다.
- 불필요한 페이지 UI 구현, 대량 리팩토링, 새 라이브러리 추가를 하지 않는다.

## 참조 문서 (작업 유형별)

작업에 해당하는 문서만 읽는다. 관련 없는 문서는 읽지 않는다.

| 작업 유형                         | 읽어야 할 문서                                                         |
| --------------------------------- | ---------------------------------------------------------------------- |
| 스타일, Panda CSS, 디자인 토큰    | `docs/design-system.md`, `docs/ai-coding-guide.md`                     |
| 컴포넌트 개발                     | `docs/design-system.md`, `docs/ai-coding-guide.md`                     |
| 라우팅, 새 페이지 추가, 경로 변경 | `docs/ROUTING.md`                                                      |
| Next.js 관련 모든 변경            | `node_modules/next/dist/docs/`                                         |
| API 연동                          | TODO: 관련 문서 미작성 — 기존 `src/lib`, `src/features` 코드 먼저 확인 |
| 상태 관리 (Zustand)               | TODO: 관련 문서 미작성 — 기존 `src/` Zustand 스토어 코드 먼저 확인     |

- `public/tokens.json`은 참고 자료로만 사용하고, 최종 컬러 기준은 `docs/design-system.md`를 따른다.

## PR 규칙

- PR base 브랜치는 항상 **`develop`** — `main`으로 절대 보내지 말 것
- PR 작성 시 `.github/PULL_REQUEST_TEMPLATE.md` 형식을 반드시 사용한다.

### PR 템플릿 항목

| 항목       | 설명                                               |
| ---------- | -------------------------------------------------- |
| 관련 이슈  | `closes #이슈번호` 형식으로 연결                   |
| 작업 내용  | 변경한 내용을 항목별로 기술                        |
| 변경 사항  | 영향 범위, 주요 수정 파일 등 기술                  |
| 스크린샷   | UI 변경 시 첨부 (선택)                             |
| 체크리스트 | 동작 확인, console.log 제거, 컨벤션 준수 여부 체크 |
