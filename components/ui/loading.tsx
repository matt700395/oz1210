/**
 * @file loading.tsx
 * @description 로딩 스피너 컴포넌트
 *
 * 이 컴포넌트는 데이터 로딩 중 사용자에게 시각적 피드백을 제공합니다.
 * PRD 7.3: 지도 로딩 시 스피너 사용
 *
 * @see {@link /docs/DESIGN.md#로딩 상태} - 디자인 가이드라인
 */

import { cn } from "@/lib/utils";

type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  /**
   * 스피너 크기
   * @default "md"
   */
  size?: LoadingSize;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 접근성을 위한 라벨
   * @default "로딩 중..."
   */
  "aria-label"?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-4",
  lg: "h-8 w-8 border-4",
};

/**
 * 로딩 스피너 컴포넌트
 *
 * @example
 * ```tsx
 * <Loading size="md" />
 * <Loading size="lg" className="text-blue-600" />
 * ```
 */
export default function Loading({
  size = "md",
  className,
  "aria-label": ariaLabel = "로딩 중...",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

