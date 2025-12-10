-- RLS 정책 예제 마이그레이션
-- 
-- 이 파일은 Clerk + Supabase 통합 시 RLS (Row Level Security) 정책을 설정하는 예제입니다.
-- 실제 프로젝트에서는 이 패턴을 참고하여 필요한 테이블에 RLS 정책을 적용하세요.
--
-- 참고: 개발 단계에서는 RLS를 비활성화할 수 있지만, 프로덕션에서는 반드시 활성화해야 합니다.

-- ============================================
-- 예제 1: Tasks 테이블 (Clerk 공식 문서 예제)
-- ============================================

-- Tasks 테이블 생성 (예제)
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    (SELECT auth.jwt()->>'sub') = user_id
);

-- INSERT 정책: 사용자는 자신의 tasks만 생성 가능
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT auth.jwt()->>'sub') = user_id
);

-- UPDATE 정책: 사용자는 자신의 tasks만 수정 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
    (SELECT auth.jwt()->>'sub') = user_id
)
WITH CHECK (
    (SELECT auth.jwt()->>'sub') = user_id
);

-- DELETE 정책: 사용자는 자신의 tasks만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
    (SELECT auth.jwt()->>'sub') = user_id
);

-- ============================================
-- 예제 2: Users 테이블 RLS 정책 (프로덕션용)
-- ============================================
-- 
-- 주의: 현재 setup_schema.sql에서 RLS가 비활성화되어 있습니다.
-- 프로덕션 배포 시 아래 정책을 활성화하세요.

-- RLS 활성화 (프로덕션에서만 실행)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 정보만 조회 가능
-- CREATE POLICY "Users can view their own profile"
-- ON public.users
-- FOR SELECT
-- TO authenticated
-- USING (
--     (SELECT auth.jwt()->>'sub') = clerk_id
-- );

-- INSERT 정책: 새 사용자 생성 허용 (동기화용)
-- CREATE POLICY "Users can insert their own profile"
-- ON public.users
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     (SELECT auth.jwt()->>'sub') = clerk_id
-- );

-- UPDATE 정책: 사용자는 자신의 정보만 수정 가능
-- CREATE POLICY "Users can update their own profile"
-- ON public.users
-- FOR UPDATE
-- TO authenticated
-- USING (
--     (SELECT auth.jwt()->>'sub') = clerk_id
-- )
-- WITH CHECK (
--     (SELECT auth.jwt()->>'sub') = clerk_id
-- );

-- ============================================
-- RLS 정책 패턴 설명
-- ============================================
--
-- 1. auth.jwt()->>'sub' 사용
--    - Clerk user ID를 가져옵니다
--    - USING 절: 기존 데이터 조회/수정/삭제 시 조건
--    - WITH CHECK 절: 새 데이터 삽입/수정 시 조건
--
-- 2. TO authenticated
--    - 인증된 사용자에게만 정책 적용
--    - TO anon: 익명 사용자용 정책 (필요 시)
--
-- 3. 정책 타입
--    - FOR SELECT: 조회 권한
--    - FOR INSERT: 삽입 권한
--    - FOR UPDATE: 수정 권한
--    - FOR DELETE: 삭제 권한
--    - FOR ALL: 모든 작업에 대한 권한
--
-- 4. 기본 패턴
--    ```sql
--    CREATE POLICY "policy_name"
--    ON table_name
--    FOR operation
--    TO authenticated
--    USING (auth.jwt()->>'sub' = user_id_column)
--    WITH CHECK (auth.jwt()->>'sub' = user_id_column)
--    ```

