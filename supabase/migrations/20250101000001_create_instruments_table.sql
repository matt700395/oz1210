-- Instruments 테이블 생성 (Supabase 공식 Next.js 가이드 예제)
-- 
-- 이 마이그레이션은 Supabase 공식 Next.js 퀵스타트 가이드의 예제를 기반으로 작성되었습니다.
-- @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
--
-- 사용 방법:
-- 1. Supabase Dashboard → SQL Editor에서 실행
-- 2. 또는 `supabase db push` 명령어로 마이그레이션 적용

-- 테이블 생성
CREATE TABLE IF NOT EXISTS public.instruments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

-- 샘플 데이터 삽입
INSERT INTO public.instruments (name)
VALUES
    ('violin'),
    ('viola'),
    ('cello')
ON CONFLICT DO NOTHING;

-- RLS 활성화
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (anon 역할)
-- 모든 사용자가 instruments를 읽을 수 있도록 설정
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);

-- 인증된 사용자도 읽기 가능
CREATE POLICY "authenticated can read instruments"
ON public.instruments
FOR SELECT
TO authenticated
USING (true);

