import Link from "next/link";

/**
 * @file Footer.tsx
 * @description 전역 Footer 컴포넌트
 *
 * 모든 페이지 하단에 표시되는 Footer입니다.
 * 저작권 정보, 네비게이션 링크, API 제공 정보를 포함합니다.
 *
 * 주요 기능:
 * 1. 저작권 표시 (My Trip © 2025)
 * 2. About, Contact 링크 (placeholder)
 * 3. 한국관광공사 API 제공 표시
 *
 * 스타일링:
 * - Tailwind CSS 유틸리티 사용
 * - Spacing-First 정책 준수 (padding, gap)
 * - 반응형 디자인 (모바일/데스크톱)
 * - 다크모드 지원
 *
 * @dependencies
 * - next/link: Next.js 라우팅
 */

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 왼쪽: 저작권 */}
          <div className="text-sm text-muted-foreground">
            My Trip © 2025
          </div>

          {/* 중앙: 링크 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* 오른쪽: API 제공 */}
          <div className="text-sm text-muted-foreground">
            한국관광공사 API 제공
          </div>
        </div>
      </div>
    </footer>
  );
}

