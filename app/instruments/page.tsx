import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

/**
 * Instruments 데이터를 가져오는 Server Component
 *
 * Supabase 공식 Next.js 퀵스타트 가이드 예제를 기반으로 작성되었습니다.
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select("*");

  if (error) {
    console.error("Error fetching instruments:", error);
    return <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!instruments || instruments.length === 0) {
    return <div className="text-gray-500">데이터가 없습니다.</div>;
  }

  return (
    <div className="space-y-2">
      {instruments.map((instrument: any) => (
        <div
          key={instrument.id}
          className="p-4 bg-gray-100 rounded-lg border border-gray-200"
        >
          <p className="text-lg font-medium">{instrument.name}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Instruments 페이지
 *
 * Supabase에서 instruments 테이블의 데이터를 조회하여 표시합니다.
 */
export default function Instruments() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">악기 목록</h1>
      <Suspense fallback={<div className="text-gray-500">로딩 중...</div>}>
        <InstrumentsData />
      </Suspense>
    </div>
  );
}

