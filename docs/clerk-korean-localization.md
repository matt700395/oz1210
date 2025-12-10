# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 현재 설정

프로젝트는 이미 한국어 로컬라이제이션이 적용되어 있습니다:

- `@clerk/localizations` 패키지 사용
- `koKR` 로컬라이제이션 적용
- `app/layout.tsx`에서 `ClerkProvider`에 설정

## 설정 위치

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        {children}
      </html>
    </ClerkProvider>
  );
}
```

## 커스텀 에러 메시지 설정

기본 한국어 번역에 추가로 커스텀 에러 메시지를 설정할 수 있습니다:

```tsx
import { koKR } from "@clerk/localizations";

const koreanLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    // 커스텀 에러 메시지 추가
    not_allowed_access: "접근이 허용되지 않은 이메일 도메인입니다. 관리자에게 문의하세요.",
    form_identifier_not_found: "입력하신 이메일 주소를 찾을 수 없습니다.",
    form_password_pwned: "이 비밀번호는 보안상 위험합니다. 다른 비밀번호를 사용해주세요.",
  },
};

<ClerkProvider localization={koreanLocalization}>
  {children}
</ClerkProvider>
```

## 지원되는 에러 키

다음 에러 키들을 커스터마이징할 수 있습니다:

- `not_allowed_access`: 허용되지 않은 이메일 도메인
- `form_identifier_not_found`: 사용자를 찾을 수 없음
- `form_password_pwned`: 보안상 위험한 비밀번호
- `form_password_length_too_short`: 비밀번호가 너무 짧음
- `form_password_validation_failed`: 비밀번호 검증 실패
- `form_username_invalid`: 유효하지 않은 사용자명
- `form_email_address_invalid`: 유효하지 않은 이메일 주소
- `form_phone_number_invalid`: 유효하지 않은 전화번호

전체 에러 키 목록은 [Clerk 공식 문서](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)의 `unstable__errors` 객체를 참고하세요.

## 주의사항

1. **실험적 기능**: `unstable__errors`는 현재 실험적 기능입니다. 향후 변경될 수 있습니다.

2. **컴포넌트만 적용**: 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다. Clerk Account Portal은 여전히 영어로 표시됩니다.

3. **HTML lang 속성**: `<html lang="ko">`를 설정하여 브라우저에 한국어 사이트임을 알려주세요.

## 테스트

로컬라이제이션이 제대로 적용되었는지 확인하려면:

1. 개발 서버 실행: `pnpm dev`
2. 로그인/회원가입 페이지 접속
3. 모든 텍스트가 한국어로 표시되는지 확인
4. 에러 메시지가 한국어로 표시되는지 확인

## 추가 리소스

- [Clerk 로컬라이제이션 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)
- [지원되는 언어 목록](https://clerk.com/docs/guides/customizing-clerk/localization#languages)
- [영어 로컬라이제이션 파일 (참고용)](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)

