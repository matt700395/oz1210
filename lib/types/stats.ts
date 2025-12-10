/**
 * @file stats.ts
 * @description 통계 대시보드 관련 타입 정의
 *
 * 이 파일은 통계 대시보드 페이지에서 사용하는 타입들을 정의합니다.
 *
 * 주요 타입:
 * - RegionStats: 지역별 관광지 통계
 * - TypeStats: 타입별 관광지 통계
 * - StatsSummary: 통계 요약 정보
 *
 * @see {@link /docs/PRD.md#2.6 통계 대시보드} - 통계 대시보드 요구사항
 */

import type { ContentTypeId } from "./tour";

/**
 * 지역별 관광지 통계
 */
export interface RegionStats {
  code: string; // 지역코드
  name: string; // 지역명 (예: "서울", "부산", "제주")
  count: number; // 관광지 개수
}

/**
 * 타입별 관광지 통계
 */
export interface TypeStats {
  typeId: ContentTypeId; // 콘텐츠타입ID
  typeName: string; // 타입명 (한글, 예: "관광지", "문화시설")
  count: number; // 관광지 개수
  percentage: number; // 비율 (백분율, 0-100)
}

/**
 * 통계 요약 정보
 */
export interface StatsSummary {
  totalCount: number; // 전체 관광지 수
  topRegions: RegionStats[]; // Top 3 지역 (개수 기준 내림차순)
  topTypes: TypeStats[]; // Top 3 타입 (개수 기준 내림차순)
  lastUpdated: Date; // 마지막 업데이트 시간
}

/**
 * 관광 타입 ID와 한글명 매핑
 */
export const CONTENT_TYPE_NAMES: Record<ContentTypeId, string> = {
  "12": "관광지",
  "14": "문화시설",
  "15": "축제/행사",
  "25": "여행코스",
  "28": "레포츠",
  "32": "숙박",
  "38": "쇼핑",
  "39": "음식점",
} as const;

