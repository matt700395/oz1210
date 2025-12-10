/**
 * @file tour-api.ts
 * @description 한국관광공사 공공 API 클라이언트
 *
 * 이 파일은 한국관광공사 KorService2 API를 호출하는 클라이언트 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 8개 API 엔드포인트 지원
 * 2. 공통 파라미터 자동 처리
 * 3. 에러 처리 및 재시도 로직
 * 4. 타입 안전한 API 호출
 *
 * 사용 예시:
 * ```typescript
 * import { getAreaBasedList } from '@/lib/api/tour-api';
 *
 * const result = await getAreaBasedList({
 *   areaCode: '1',
 *   contentTypeId: '12',
 *   numOfRows: 10
 * });
 * ```
 *
 * @dependencies
 * - 한국관광공사 공공 API (KorService2)
 * - 환경변수: NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY
 */

import type {
  AreaCodeParams,
  AreaCodeResponse,
  AreaBasedListParams,
  DetailCommonParams,
  DetailImageParams,
  DetailIntroParams,
  DetailPetTourParams,
  PetTourInfo,
  SearchKeywordParams,
  TourApiError,
  TourApiResponse,
  TourDetail,
  TourImage,
  TourIntro,
  TourItem,
  TourListResponse,
} from "@/lib/types/tour";

// =====================================================
// 설정 및 상수
// =====================================================

/**
 * API Base URL
 */
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

/**
 * 기본 공통 파라미터
 */
const DEFAULT_PARAMS = {
  MobileOS: "ETC",
  MobileApp: "MyTrip",
  _type: "json",
} as const;

/**
 * 재시도 설정
 */
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1초

// =====================================================
// 환경변수 처리
// =====================================================

/**
 * API 키 조회 함수
 * NEXT_PUBLIC_TOUR_API_KEY를 우선 사용하고, 없으면 TOUR_API_KEY 사용
 *
 * @returns API 키
 * @throws {TourApiError} API 키가 없을 때
 */
function getApiKey(): string {
  const publicKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
  if (publicKey) {
    return publicKey;
  }

  const serverKey = process.env.TOUR_API_KEY;
  if (serverKey) {
    return serverKey;
  }

  throw new TourApiError(
    "한국관광공사 API 키가 설정되지 않았습니다. NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY 환경변수를 확인하세요."
  );
}

// =====================================================
// 공통 유틸리티 함수
// =====================================================

/**
 * URL 쿼리 문자열 생성
 * 공통 파라미터와 serviceKey를 자동으로 포함
 *
 * @param params - 추가 파라미터 객체
 * @returns 쿼리 문자열
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const apiKey = getApiKey();
  const allParams = {
    ...DEFAULT_PARAMS,
    serviceKey: apiKey,
    ...params,
  };

  const queryParams = Object.entries(allParams)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return queryParams;
}

/**
 * API 응답 파싱
 * 공통 응답 구조에서 실제 데이터를 추출
 *
 * @param response - API 응답 객체
 * @returns 파싱된 데이터
 * @throws {TourApiError} API 에러 응답일 때
 */
function parseApiResponse<T>(response: TourApiResponse<T>): T | T[] {
  const { header, body } = response.response;

  // API 에러 응답 처리
  if (header.resultCode !== "0000") {
    throw new TourApiError(
      `API 호출 실패: ${header.resultMsg}`,
      header.resultCode
    );
  }

  // items.item 추출
  const item = body.items?.item;
  if (!item) {
    return [] as T[];
  }

  // 배열이면 그대로, 단일 객체면 배열로 변환
  return Array.isArray(item) ? item : [item];
}

/**
 * 재시도 로직이 포함된 fetch 함수
 * 네트워크 에러나 HTTP 5xx 에러 시 자동 재시도 (지수 백오프)
 *
 * @param url - 요청 URL
 * @param options - fetch 옵션
 * @param retries - 남은 재시도 횟수
 * @returns fetch 응답
 * @throws {TourApiError} 최대 재시도 횟수 초과 시
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // HTTP 5xx 에러는 재시도
    if (response.status >= 500 && retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    // 네트워크 에러는 재시도
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    // 최대 재시도 횟수 초과
    const retryCount = MAX_RETRIES - retries;
    throw new TourApiError(
      `API 호출 실패: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      undefined,
      retryCount
    );
  }
}

// =====================================================
// API 함수 구현
// =====================================================

/**
 * 지역코드 조회 (areaCode2)
 * 지역 필터 생성 시 사용
 *
 * @param params - 조회 파라미터 (선택 사항)
 * @returns 지역코드 목록
 */
export async function getAreaCode(
  params: AreaCodeParams = {}
): Promise<AreaCodeResponse[]> {
  const queryString = buildQueryString(params);
  const url = `${BASE_URL}/areaCode2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<AreaCodeResponse>;

  const items = parseApiResponse(data);
  return Array.isArray(items) ? items : [items];
}

/**
 * 지역 기반 관광정보 조회 (areaBasedList2)
 * 관광지 목록 페이지에서 사용
 *
 * @param params - 조회 파라미터
 * @returns 관광지 목록 및 총 개수
 */
export async function getAreaBasedList(
  params: AreaBasedListParams
): Promise<TourListResponse> {
  const queryString = buildQueryString({
    ...params,
    areaCode: params.areaCode || undefined, // 빈 문자열이면 undefined로 처리
  });
  const url = `${BASE_URL}/areaBasedList2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<TourItem>;

  const items = parseApiResponse(data);
  const itemArray = Array.isArray(items) ? items : [items];

  return {
    items: itemArray,
    totalCount: data.response.body.totalCount || itemArray.length,
  };
}

/**
 * 키워드 검색 (searchKeyword2)
 * 검색 기능에서 사용
 *
 * @param params - 검색 파라미터
 * @returns 검색 결과 목록 및 총 개수
 */
export async function searchKeyword(
  params: SearchKeywordParams
): Promise<TourListResponse> {
  if (!params.keyword || params.keyword.trim() === "") {
    throw new TourApiError("검색 키워드를 입력해주세요.");
  }

  const queryString = buildQueryString({
    ...params,
    keyword: params.keyword.trim(),
  });
  const url = `${BASE_URL}/searchKeyword2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<TourItem>;

  const items = parseApiResponse(data);
  const itemArray = Array.isArray(items) ? items : [items];

  return {
    items: itemArray,
    totalCount: data.response.body.totalCount || itemArray.length,
  };
}

/**
 * 공통 정보 조회 (detailCommon2)
 * 상세페이지 기본 정보에서 사용
 *
 * @param params - 조회 파라미터
 * @returns 관광지 상세 정보
 */
export async function getDetailCommon(
  params: DetailCommonParams
): Promise<TourDetail> {
  if (!params.contentId) {
    throw new TourApiError("contentId는 필수 파라미터입니다.");
  }

  const queryString = buildQueryString({
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
    defaultYN: params.defaultYN || "Y",
    firstImageYN: params.firstImageYN || "Y",
    addrinfoYN: params.addrinfoYN || "Y",
    mapinfoYN: params.mapinfoYN || "Y",
    overviewYN: params.overviewYN || "Y",
  });
  const url = `${BASE_URL}/detailCommon2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<TourDetail>;

  const items = parseApiResponse(data);
  const item = Array.isArray(items) ? items[0] : items;

  if (!item) {
    throw new TourApiError("관광지 정보를 찾을 수 없습니다.");
  }

  return item;
}

/**
 * 소개 정보 조회 (detailIntro2)
 * 상세페이지 운영 정보에서 사용
 *
 * @param params - 조회 파라미터
 * @returns 관광지 운영 정보
 */
export async function getDetailIntro(
  params: DetailIntroParams
): Promise<TourIntro> {
  if (!params.contentId) {
    throw new TourApiError("contentId는 필수 파라미터입니다.");
  }
  if (!params.contentTypeId) {
    throw new TourApiError("contentTypeId는 필수 파라미터입니다.");
  }

  const queryString = buildQueryString({
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
  });
  const url = `${BASE_URL}/detailIntro2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<TourIntro>;

  const items = parseApiResponse(data);
  const item = Array.isArray(items) ? items[0] : items;

  if (!item) {
    throw new TourApiError("관광지 운영 정보를 찾을 수 없습니다.");
  }

  return item;
}

/**
 * 이미지 목록 조회 (detailImage2)
 * 상세페이지 이미지 갤러리에서 사용
 *
 * @param params - 조회 파라미터
 * @returns 이미지 목록
 */
export async function getDetailImage(
  params: DetailImageParams
): Promise<TourImage[]> {
  if (!params.contentId) {
    throw new TourApiError("contentId는 필수 파라미터입니다.");
  }

  const queryString = buildQueryString({
    contentId: params.contentId,
    imageYN: params.imageYN || "Y",
    subImageYN: params.subImageYN || "Y",
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
  });
  const url = `${BASE_URL}/detailImage2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<TourImage>;

  const items = parseApiResponse(data);
  return Array.isArray(items) ? items : [items];
}

/**
 * 반려동물 정보 조회 (detailPetTour2)
 * 상세페이지 반려동물 동반 정보에서 사용
 *
 * @param params - 조회 파라미터
 * @returns 반려동물 정보 (없으면 null)
 */
export async function getDetailPetTour(
  params: DetailPetTourParams
): Promise<PetTourInfo | null> {
  if (!params.contentId) {
    throw new TourApiError("contentId는 필수 파라미터입니다.");
  }

  const queryString = buildQueryString({
    contentId: params.contentId,
  });
  const url = `${BASE_URL}/detailPetTour2?${queryString}`;

  const response = await fetchWithRetry(url);
  const data = (await response.json()) as TourApiResponse<PetTourInfo>;

  const items = parseApiResponse(data);
  const item = Array.isArray(items) ? items[0] : items;

  // 반려동물 정보가 없을 수 있음
  return item || null;
}

