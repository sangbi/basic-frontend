# Frontend Base Platform Guide

## 1. 목표

여러 프로젝트에서 재사용 가능한 프론트 베이스 플랫폼 구축

- pnpm workspace + Turborepo 기반 모노레포
- web / admin / 향후 mobile 확장 가능 구조
- 공통 UI / theme / api / auth / types 재사용
- 로그인 / refresh / middleware / role guard 포함
- CRUD 화면을 빠르게 생산할 수 있는 스타터 플랫폼

---

## 2. 현재 구조

```plaintext
apps/
  web/
  admin/

packages/
  api/
  auth/
  theme/
  types/
  ui/
  config/
```

### apps
- web: 일반 사용자 서비스
- admin: 관리자 서비스
- mobile: 향후 Expo / React Native 추가 예정

### packages
- @repo/api: axios client, auth/user/code API, interceptor, error handling
- @repo/auth: token storage, role util, route guard helper
- @repo/theme: MUI theme
- @repo/types: 공통 응답 / 요청 / 도메인 타입
- @repo/ui: 공통 컴포넌트, feedback, form, business, display
- @repo/config: 공통 설정용 패키지

---

## 3. 인증 구조

### 현재 적용 상태
- access token: localStorage
- refresh token: httpOnly cookie
- axios interceptor로 Authorization 자동 첨부
- 401 발생 시 /auth/refresh 재발급
- middleware가 refresh cookie 기준으로 보호 라우트 접근 차단

### 흐름
1. 로그인
   - accessToken은 응답 body로 받음
   - refreshToken은 쿠키로 저장

2. 일반 API 호출
   - interceptor가 accessToken을 Authorization 헤더에 첨부

3. accessToken 만료
   - 401 발생
   - /auth/refresh 호출
   - 새 accessToken 저장
   - 원래 요청 재시도

4. 로그아웃
   - accessToken 삭제
   - refresh cookie 삭제

---

## 4. 공통 UI 패턴

### business
- PageHeader
- SearchPanel
- DataTable
- EmptyState
- ConfirmDialog

### feedback
- FeedbackProvider
- useFeedback
- LoadingOverlay

### form
- FormTextField
- FormSelectField
- FormSection

### display
- DetailCard
- InfoRow
- StatusChip

---

## 5. 도메인 패턴

예시 도메인:
- users
- codes

### 공통 패턴
- 검색: POST /{domain}/search
- 요청 구조: PageQueryRequest<T>
- 응답 구조: ApiResponse<PageResponse<T>>
- 페이지에서는 useQuery / useMutation 또는 일반 query fn 사용
- CRUD 화면은 공통 UI 컴포넌트로 구성

---

## 6. 권한 / 가드 구조

### 공통 타입
- UserRole = "USER" | "ADMIN"

### 공통 유틸
- hasRequiredRole
- filterMenusByRole
- createUseAuthGuard

### 앱별 훅
- web: useAppAuthGuard
- admin: useAdminAuthGuard

### 앱별 메뉴
- web / admin 각각 menu.ts 분리
- roles는 반드시 UserRole[] 사용

---

## 7. 앱 분리 원칙

### packages에 둘 것
- 공통 UI
- 공통 theme
- API client
- auth util
- types
- 공통 에러 처리

### apps에 둘 것
- 메뉴 정의
- 앱별 레이아웃
- 앱별 페이지 라우팅
- 앱별 대시보드/화면 조합
- 앱별 브랜딩

---

## 8. 새 앱 추가 방법

예: mobile 또는 새 web 앱

1. apps 하위에 새 앱 생성
2. workspace 패키지 연결
3. next.config / expo config 등에서 공통 패키지 사용 설정
4. providers 연결
5. 앱별 layout / navigation / pages 추가
6. auth guard / role guard 적용

---

## 9. 새 도메인 추가 방법

1. packages/types에 타입 추가
2. packages/api에 API 함수 추가
3. apps/{app}/features/{domain}에 hooks / queryKeys 추가
4. app/{route} 페이지 생성
5. 공통 UI 컴포넌트로 목록/상세/폼 화면 조합

---

## 10. 주의사항

- roles 타입은 string[]가 아니라 UserRole[] 사용
- access token은 localStorage, refresh token은 JS에서 직접 다루지 않음
- axios client는 withCredentials: true 필수
- interceptor는 앱 시작 시 즉시 등록
- middleware는 refresh cookie 기준으로 동작
- 공통 UI는 packages/ui에, 앱별 조합은 apps에 둔다

---

## 11. 다음 고도화 후보

- TanStack Query 전면 표준화
- form validation 표준화
- SSR auth 고도화
- cookie 기반 access 전략 재검토
- mobile 앱 추가
- Storybook / 디자인 시스템 확장

---

## 12. 현재 상태 평가

현재 프론트는 단일 프로젝트가 아니라 다음 성격에 가깝다.

- 재사용 가능한 모노레포 프론트 베이스
- web / admin 다중 앱 확장 가능
- 인증 / 권한 / CRUD / 공통 UI 패턴 내장
- 여러 프로젝트를 빠르게 시작할 수 있는 스타터 플랫폼
