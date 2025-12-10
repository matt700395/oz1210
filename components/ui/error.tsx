/**
 * @file error.tsx
 * @description 에러 메시지 표시 컴포넌트
 *
 * 이 컴포넌트는 API 에러, 네트워크 에러 등 다양한 에러 상황을 사용자에게 표시합니다.
 * PRD 7.4: API 에러 메시지 표시 + 재시도 버튼
 *
 * @see {@link /docs/PRD.md#7.4 에러 처리} - 에러 처리 요구사항
 */

import { AlertCircle, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ErrorType = "api" | "network" | "not-found" | "generic";

interface ErrorDisplayProps {
  /**
   * 에러 메시지
   */
  message?: string;
  /**
   * 에러 타입
   * @default "generic"
   */
  type?: ErrorType;
  /**
   * 재시도 핸들러 (제공 시 재시도 버튼 표시)
   */
  onRetry?: () => void;
  /**
   * 재시도 중인지 여부
   * @default false
   */
  isRetrying?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 컴팩트 모드 (작은 크기)
   * @default false
   */
  compact?: boolean;
}

const defaultMessages: Record<ErrorType, string> = {
  api: "데이터를 불러오는 중 오류가 발생했습니다.",
  network: "네트워크 연결을 확인해주세요.",
  "not-found": "요청하신 정보를 찾을 수 없습니다.",
  generic: "오류가 발생했습니다.",
};

const errorIcons: Record<ErrorType, typeof AlertCircle> = {
  api: AlertCircle,
  network: WifiOff,
  "not-found": AlertCircle,
  generic: AlertCircle,
};

/**
 * 에러 메시지 표시 컴포넌트
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   message="API 호출 실패"
 *   type="api"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export default function ErrorDisplay({
  message,
  type = "generic",
  onRetry,
  isRetrying = false,
  className,
  compact = false,
}: ErrorDisplayProps) {
  const displayMessage = message || defaultMessages[type];
  const Icon = errorIcons[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border border-destructive/20 bg-destructive/5",
        compact && "p-4 gap-2",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-5 w-5 text-destructive",
            compact && "h-4 w-4"
          )}
          aria-hidden="true"
        />
        <p
          className={cn(
            "text-sm font-medium text-destructive",
            compact && "text-xs"
          )}
        >
          {displayMessage}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={onRetry}
          disabled={isRetrying}
          className="gap-2"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              isRetrying && "animate-spin"
            )}
            aria-hidden="true"
          />
          {isRetrying ? "재시도 중..." : "재시도"}
        </Button>
      )}
    </div>
  );
}

