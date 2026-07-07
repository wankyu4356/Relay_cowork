-- ============================================================
-- ④⑤ 지원: 세션 워크스페이스 러너 접근 + 관리자 AI 원장 조회
-- ============================================================

-- ④ 러너가 (세션으로 연결된) 멘티의 문서 메타를 읽을 수 있어야
--    워크스페이스에서 첨삭 대상 문서를 열 수 있다.
--    (버전 select/mentor_edit insert 정책은 005에 이미 존재)
create policy doc_runner_select on documents for select to authenticated
  using (
    exists (
      select 1 from sessions s
      where s.mentor_id = auth.uid() and s.user_id = documents.user_id
    )
  );

-- ⑤ 관리자 AI 원장 대시보드 조회
create policy aig_admin_select on ai_generations for select to authenticated
  using (public.is_admin());

create policy aif_admin_select on ai_feedback for select to authenticated
  using (public.is_admin());
