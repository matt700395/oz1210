# Clerk + Supabase 통합 사용 예제

이 문서는 Clerk와 Supabase를 통합하여 사용하는 실제 예제 코드를 제공합니다.

## 목차

1. [Client Component에서 사용하기](#client-component에서-사용하기)
2. [Server Component에서 사용하기](#server-component에서-사용하기)
3. [Server Action에서 사용하기](#server-action에서-사용하기)
4. [RLS 정책과 함께 사용하기](#rls-정책과-함께-사용하기)

---

## Client Component에서 사용하기

Client Component에서는 `useClerkSupabaseClient` 훅을 사용합니다.

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export default function TasksPage() {
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    }

    loadTasks();
  }, [supabase]);

  async function createTask(name: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name });

    if (error) {
      console.error('Error creating task:', error);
    } else {
      // 성공 시 목록 새로고침
      window.location.reload();
    }
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">내 할 일 목록</h1>
      
      <ul className="space-y-2 mb-6">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 bg-gray-100 rounded">
            {task.name}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get('name') as string;
          createTask(name);
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="새 할 일 입력"
          className="border p-2 rounded mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
      </form>
    </div>
  );
}
```

---

## Server Component에서 사용하기

Server Component에서는 `createClerkSupabaseClient` 함수를 사용합니다.

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function TasksPage() {
  const supabase = createClerkSupabaseClient();

  // RLS 정책에 따라 현재 사용자의 tasks만 조회됩니다
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to load tasks');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">내 할 일 목록</h1>
      
      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="p-3 bg-gray-100 rounded">
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Server Action에서 사용하기

Server Action에서도 `createClerkSupabaseClient`를 사용할 수 있습니다.

```tsx
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTask(name: string) {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error('Failed to create task');
  }

  // 페이지 캐시 무효화
  revalidatePath('/tasks');

  return { success: true, data };
}

export async function deleteTask(taskId: number) {
  const supabase = createClerkSupabaseClient();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    throw new Error('Failed to delete task');
  }

  revalidatePath('/tasks');

  return { success: true };
}
```

Server Action을 사용하는 Client Component:

```tsx
'use client';

import { createTask, deleteTask } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TasksClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreateTask(formData: FormData) {
    setLoading(true);
    const name = formData.get('name') as string;
    
    try {
      await createTask(name);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleCreateTask}>
      <input
        type="text"
        name="name"
        placeholder="새 할 일 입력"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? '추가 중...' : '추가'}
      </button>
    </form>
  );
}
```

---

## RLS 정책과 함께 사용하기

RLS (Row Level Security) 정책이 활성화된 테이블에서는 자동으로 사용자별 데이터 접근이 제한됩니다.

### RLS 정책 예제

```sql
-- 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    (SELECT auth.jwt()->>'sub') = user_id
);
```

### 코드에서의 동작

RLS 정책이 활성화되면, 아래 코드는 자동으로 현재 로그인한 사용자의 데이터만 반환합니다:

```tsx
// Server Component
const supabase = createClerkSupabaseClient();

// RLS 정책에 의해 자동으로 필터링됨
// WHERE user_id = auth.jwt()->>'sub' 가 자동 적용
const { data } = await supabase.from('tasks').select('*');
```

### RLS 정책 확인

RLS가 제대로 작동하는지 확인하려면:

1. **다른 사용자로 로그인**: 다른 계정으로 로그인했을 때 데이터가 보이지 않아야 합니다
2. **로그아웃 상태**: 인증되지 않은 사용자는 데이터에 접근할 수 없어야 합니다
3. **Supabase Dashboard**: Dashboard에서 직접 쿼리할 때는 모든 데이터가 보이지만, 애플리케이션에서는 필터링됩니다

---

## 주의사항

### 1. accessToken 함수 사용 시

`accessToken` 옵션을 사용하면 `supabase.auth`는 사용할 수 없습니다:

```tsx
// ❌ 작동하지 않음
const { data: user } = await supabase.auth.getUser();

// ✅ Clerk 훅 사용
import { useUser } from '@clerk/nextjs';
const { user } = useUser();
```

### 2. 환경 변수

`.env.local` 파일에 다음 변수가 설정되어 있어야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. RLS 정책 테스트

개발 중에는 RLS를 비활성화할 수 있지만, 프로덕션에서는 반드시 활성화해야 합니다:

```sql
-- 개발 중 (비권장, 프로덕션에서 절대 사용 금지)
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- 프로덕션
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
```

---

## 추가 리소스

- [Clerk 공식 Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase RLS 정책 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/clerk)

