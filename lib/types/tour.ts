/**
 * @file tour.ts
 * @description 한국관광공사 API 관련 타입 정의
 *
 * 이 파일은 한국관광공사 공공 API(KorService2)의 요청/응답 타입을 정의합니다.
 *
 * 주요 타입:
 * - TourItem: 관광지 목록 항목
 * - TourDetail: 관광지 상세 정보
 * - TourIntro: 관광지 운영 정보
 * - TourImage: 관광지 이미지 정보
 * - PetTourInfo: 반려동물 동반 여행 정보
 * - API 응답 래퍼 타입들
 * - API 요청 파라미터 타입들
 */

/**
 * 관광 타입 ID 유니온 타입
 * 12: 관광지, 14: 문화시설, 15: 축제/행사, 25: 여행코스,
 * 28: 레포츠, 32: 숙박, 38: 쇼핑, 39: 음식점
 */
export type ContentTypeId = "12" | "14" | "15" | "25" | "28" | "32" | "38" | "39";

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 */
export interface TourItem {
  addr1: string; // 주소
  addr2?: string; // 상세주소
  areacode: string; // 지역코드
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  tel?: string; // 전화번호
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  modifiedtime: string; // 수정일 (YYYYMMDDHHmmss)
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  homepage?: string;
  overview?: string; // 개요 (긴 설명)
  firstimage?: string;
  firstimage2?: string;
  mapx: string; // 경도
  mapy: string; // 위도
}

/**
 * 관광지 운영 정보 (detailIntro2 응답)
 * 타입별로 필드가 다르므로 모든 가능한 필드를 optional로 정의
 */
export interface TourIntro {
  contentid: string;
  contenttypeid: string;
  // 공통 필드
  usetime?: string; // 이용시간
  restdate?: string; // 휴무일
  infocenter?: string; // 문의처
  parking?: string; // 주차 가능
  chkpet?: string; // 반려동물 동반
  // 숙박 관련
  checkintime?: string; // 체크인 시간
  checkouttime?: string; // 체크아웃 시간
  reservationlodging?: string; // 예약 안내
  // 음식점 관련
  opentimefood?: string; // 영업시간
  reservationfood?: string; // 예약 안내
  firstmenu?: string; // 대표 메뉴
  treatmenu?: string; // 취급 메뉴
  // 레포츠 관련
  openperiod?: string; // 개장기간
  reservation?: string; // 예약 안내
  // 기타
  accomcount?: string; // 수용인원
  expguide?: string; // 체험 안내
  expagerange?: string; // 체험가능 연령
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  contentid: string;
  imagename?: string; // 이미지명
  originimgurl?: string; // 원본 이미지 URL
  serialnum?: string; // 이미지 순번
  smallimageurl?: string; // 썸네일 이미지 URL
}

/**
 * 반려동물 동반 여행 정보 (detailPetTour2 응답)
 */
export interface PetTourInfo {
  contentid: string;
  contenttypeid: string;
  chkpetleash?: string; // 애완동물 동반 여부
  chkpetsize?: string; // 애완동물 크기
  chkpetplace?: string; // 입장 가능 장소
  chkpetfee?: string; // 추가 요금
  petinfo?: string; // 기타 반려동물 정보
  parking?: string; // 주차장 정보
}

/**
 * 지역코드 응답 (areaCode2 응답)
 */
export interface AreaCodeResponse {
  code: string; // 지역코드
  name: string; // 지역명
  rnum?: number; // 번호
}

/**
 * 한국관광공사 API 공통 응답 헤더
 */
export interface TourApiResponseHeader {
  resultCode: string; // 응답 코드 ("0000"이면 성공)
  resultMsg: string; // 응답 메시지
}

/**
 * 한국관광공사 API 공통 응답 바디
 */
export interface TourApiResponseBody<T> {
  items: {
    item?: T | T[]; // 단일 객체 또는 배열
  };
  numOfRows?: number;
  pageNo?: number;
  totalCount?: number;
}

/**
 * 한국관광공사 API 공통 응답 구조
 */
export interface TourApiResponse<T> {
  response: {
    header: TourApiResponseHeader;
    body: TourApiResponseBody<T>;
  };
}

/**
 * 지역코드 조회 파라미터 (areaCode2)
 */
export interface AreaCodeParams {
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
  areaCode?: string; // 지역코드 (상위 지역 코드, 선택 사항)
}

/**
 * 지역 기반 목록 조회 파라미터 (areaBasedList2)
 */
export interface AreaBasedListParams {
  areaCode?: string; // 지역코드 (빈 값이면 전체)
  contentTypeId?: ContentTypeId; // 콘텐츠타입ID
  numOfRows?: number; // 한 페이지 결과 수 (기본 10)
  pageNo?: number; // 페이지 번호 (기본 1)
  arrange?: "A" | "B" | "C" | "D"; // 정렬 구분 (A=제목순, B=조회순, C=수정일순, D=생성일순)
}

/**
 * 키워드 검색 파라미터 (searchKeyword2)
 */
export interface SearchKeywordParams {
  keyword: string; // 검색 키워드
  areaCode?: string; // 지역코드
  contentTypeId?: ContentTypeId; // 콘텐츠타입ID
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
  arrange?: "A" | "B" | "C" | "D"; // 정렬 구분
}

/**
 * 공통 정보 조회 파라미터 (detailCommon2)
 */
export interface DetailCommonParams {
  contentId: string; // 콘텐츠ID (필수)
  contentTypeId?: ContentTypeId; // 콘텐츠타입ID
  defaultYN?: "Y" | "N"; // 기본정보 조회여부
  firstImageYN?: "Y" | "N"; // 대표이미지 조회여부
  areacodeYN?: "Y" | "N"; // 지역코드 조회여부
  catcodeYN?: "Y" | "N"; // 서비스분류코드 조회여부
  addrinfoYN?: "Y" | "N"; // 주소정보 조회여부
  mapinfoYN?: "Y" | "N"; // 좌표정보 조회여부
  overviewYN?: "Y" | "N"; // 개요정보 조회여부
}

/**
 * 소개 정보 조회 파라미터 (detailIntro2)
 */
export interface DetailIntroParams {
  contentId: string; // 콘텐츠ID (필수)
  contentTypeId: ContentTypeId; // 콘텐츠타입ID (필수)
}

/**
 * 이미지 목록 조회 파라미터 (detailImage2)
 */
export interface DetailImageParams {
  contentId: string; // 콘텐츠ID (필수)
  imageYN?: "Y" | "N"; // 이미지 조회여부
  subImageYN?: "Y" | "N"; // 서브 이미지 조회여부
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
}

/**
 * 반려동물 정보 조회 파라미터 (detailPetTour2)
 */
export interface DetailPetTourParams {
  contentId: string; // 콘텐츠ID (필수)
}

/**
 * API 목록 응답 (items 배열과 totalCount 포함)
 */
export interface TourListResponse {
  items: TourItem[];
  totalCount: number;
}

/**
 * 커스텀 API 에러 클래스
 */
export class TourApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public retries?: number
  ) {
    super(message);
    this.name = "TourApiError";
    Object.setPrototypeOf(this, TourApiError.prototype);
  }
}

