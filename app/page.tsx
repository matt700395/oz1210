/**
 * @file page.tsx
 * @description 홈페이지 - 관광지 목록
 *
 * My Trip 서비스의 메인 홈페이지입니다.
 * 관광지 목록, 필터, 검색, 지도 기능이 통합된 페이지입니다.
 *
 * 주요 기능:
 * 1. 관광지 목록 표시 (Phase 2.2에서 구현 예정)
 * 2. 필터 기능 (지역, 타입, 반려동물) (Phase 2.3에서 구현 예정)
 * 3. 검색 기능 (Phase 2.4에서 구현 예정)
 * 4. 네이버 지도 연동 (Phase 2.5에서 구현 예정)
 *
 * 레이아웃:
 * - 헤더: app/layout.tsx의 Navbar 컴포넌트
 * - 메인: 반응형 컨테이너 (max-w-7xl)
 * - 푸터: app/layout.tsx의 Footer 컴포넌트
 *
 * @dependencies
 * - Next.js App Router
 * - Tailwind CSS
 */

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Phase 2.2에서 관광지 목록 추가 예정 */}
        <div className="text-center text-muted-foreground">
          <p>관광지 목록이 여기에 표시됩니다</p>
        </div>
      </div>
    </main>
  );
}
