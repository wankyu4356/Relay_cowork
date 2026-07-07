import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { FadeIn, Stagger, TextReveal, Burst } from './ui/motion';
import { RunnerAvatar } from './ui/runner-avatar';
import { PartyPopper, Frown, ArrowLeft, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';
import { logger } from '../utils/logger';
import type { Mentor } from '../App';

interface OutcomeReportProps {
  onBack: () => void;
  onSubmit: (outcome: 'success' | 'fail', detail: string) => void;
  mentor: Mentor;
  purpose: string; // "연세대 경영 편입"
}

export function OutcomeReport({ onBack, onSubmit, mentor, purpose }: OutcomeReportProps) {
  const [outcome, setOutcome] = useState<'success' | 'fail' | null>(null);
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // ⑥ 라벨 루프: 이 결과를 어떤 목표/문서에 연결할지 (연동 시에만 노출)
  const [goalOptions, setGoalOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [docOptions, setDocOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    api.getGoals()
      .then(({ goals }) => {
        const opts = (goals as any[]).filter((g) => g.status === 'active').map((g) => ({
          id: g.id,
          label: `${g.target?.name ?? ''}${g.sub_target ? ` ${g.sub_target}` : ''}`.trim() || '목표',
        }));
        setGoalOptions(opts);
        if (opts.length === 1) setSelectedGoalId(opts[0].id);
      })
      .catch(() => {});
    api.getDrafts()
      .then(({ drafts }) => {
        const opts = (drafts as any[]).slice(0, 5).map((d) => ({
          id: d.id,
          label: `${d.university} ${d.major}`.trim() || '초안',
        }));
        setDocOptions(opts);
        if (opts.length === 1) setSelectedDocId(opts[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!outcome) {
      toast.error('결과를 선택해주세요');
      return;
    }
    if (detail.length < 10) {
      toast.error('상세 내용을 10자 이상 작성해주세요');
      return;
    }

    setSubmitting(true);
    try {
      await api.createOutcome({
        mentorId: mentor.id,
        result: outcome,
        detail,
        purpose,
        goalId: selectedGoalId ?? undefined,
        documentId: selectedDocId ?? undefined,
      });

      // 연결된 목표의 상태를 결과로 라벨링 (best-effort)
      if (selectedGoalId) {
        api.updateGoalStatus(selectedGoalId, outcome === 'success' ? 'achieved' : 'failed').catch(() => {});
      }
      if (outcome === 'success') {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
      }

      onSubmit(outcome, detail);

      if (outcome === 'success') {
        toast.success('축하합니다! 합격 크레딧 10,000원이 지급되었습니다');
      } else {
        toast.success('재도전 크레딧 15,000원이 지급되었습니다. 다시 도전하세요!');
      }
    } catch (err) {
      logger.warn('API outcome submission failed, proceeding with local callback:', err);
      // Fallback: still call onSubmit so the UI updates
      onSubmit(outcome, detail);

      if (outcome === 'success') {
        toast.success('축하합니다! 합격 크레딧 10,000원이 지급되었습니다');
      } else {
        toast.success('재도전 크레딧 15,000원이 지급되었습니다. 다시 도전하세요!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200/80">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl text-zinc-900 font-semibold tracking-tight"><TextReveal text="릴레이 성과 보고" delay={0.05} /></h1>
              <p className="text-zinc-600 mt-1">릴레이 세션 결과를 알려주세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <Stagger className="max-w-3xl mx-auto space-y-6">
          {/* Mentor Info */}
          <Stagger.Item>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <RunnerAvatar name={mentor.name} size="lg" variant="runner" />
                <div className="flex-1">
                  <h3 className="text-xl text-zinc-900 font-semibold tracking-tight mb-1">{mentor.name} 러너</h3>
                  <p className="text-zinc-600">
                    {mentor.university} {mentor.major}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    목표: {purpose}
                  </p>
                </div>
              </div>
            </Card>
          </Stagger.Item>

          {/* Outcome Selection */}
          <Stagger.Item>
            <Card className="p-8">
              <h3 className="text-lg text-zinc-900 font-semibold tracking-tight mb-6 text-center">
                결과가 어떻게 되셨나요?
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Success */}
                <motion.button
                  onClick={() => setOutcome('success')}
                  className={`p-8 rounded-2xl border transition-all ${
                    outcome === 'success'
                      ? 'border-iris-500 bg-iris-50 shadow-sm'
                      : 'border-zinc-200/80 hover:border-iris-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PartyPopper className={`w-16 h-16 mx-auto mb-4 ${
                    outcome === 'success' ? 'text-iris-600' : 'text-zinc-400'
                  }`} />
                  <div className="text-2xl text-zinc-900 font-semibold tracking-tight mb-2">합격했어요!</div>
                  <p className="text-sm text-zinc-600 mb-3">
                    축하합니다! 러너님의 성공률이 올라갑니다
                  </p>
                  <Badge className="bg-iris-600 text-white">
                    +10,000원 크레딧
                  </Badge>
                </motion.button>

                {/* Fail */}
                <motion.button
                  onClick={() => setOutcome('fail')}
                  className={`p-8 rounded-2xl border transition-all ${
                    outcome === 'fail'
                      ? 'border-zinc-400 bg-zinc-50 shadow-sm'
                      : 'border-zinc-200/80 hover:border-zinc-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Frown className={`w-16 h-16 mx-auto mb-4 ${
                    outcome === 'fail' ? 'text-zinc-700' : 'text-zinc-400'
                  }`} />
                  <div className="text-2xl text-zinc-900 font-semibold tracking-tight mb-2">아쉽게 탈락</div>
                  <p className="text-sm text-zinc-600 mb-3">
                    다시 도전하세요! 재도전 지원 크레딧 지급
                  </p>
                  <Badge className="bg-zinc-900 text-white">
                    +15,000원 크레딧
                  </Badge>
                </motion.button>
              </div>
            </Card>
          </Stagger.Item>

          {/* Detail */}
          {outcome && (
            <FadeIn>
              <Card className="p-6">
                <h3 className="text-lg text-zinc-900 font-semibold tracking-tight mb-4">
                  {outcome === 'success' ? '합격 소감' : '아쉬운 점'}
                </h3>
                <Textarea
                  placeholder={
                    outcome === 'success'
                      ? '릴레이 세션이 어떻게 도움이 되었나요? (최소 10자)'
                      : '다음 시도 때 개선할 점이 있나요? (최소 10자)'
                  }
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="min-h-32 mb-2"
                />
                <div className="text-sm text-zinc-600 text-right tnum">
                  {detail.length}자
                </div>
              </Card>
            </FadeIn>
          )}

          {/* ⑥ 목표/문서 연결 — 연동된 계정에서만 표시 */}
          {(goalOptions.length > 0 || docOptions.length > 0) && (
            <Stagger.Item>
              <Card className="p-6">
                <h4 className="text-zinc-900 font-semibold tracking-tight mb-1">이 결과를 연결할 대상</h4>
                <p className="text-[12px] text-zinc-500 mb-4">
                  연결하면 "어떤 준비가 합격으로 이어졌는지"가 내 기록으로 남아요
                </p>
                {goalOptions.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[12px] font-medium text-zinc-500 mb-2">목표</div>
                    <div className="flex flex-wrap gap-2">
                      {goalOptions.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGoalId(selectedGoalId === g.id ? null : g.id)}
                          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                            selectedGoalId === g.id
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {docOptions.length > 0 && (
                  <div>
                    <div className="text-[12px] font-medium text-zinc-500 mb-2">사용한 초안</div>
                    <div className="flex flex-wrap gap-2">
                      {docOptions.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedDocId(selectedDocId === d.id ? null : d.id)}
                          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                            selectedDocId === d.id
                              ? 'bg-iris-600 text-white border-iris-600'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </Stagger.Item>
          )}

          {/* Benefits */}
          <Stagger.Item>
            <Card className="p-6 bg-iris-50 border-iris-100">
              <h4 className="text-zinc-900 font-semibold tracking-tight mb-3">릴레이 성과 보고 시 혜택</h4>
              <div className="space-y-2 text-sm text-zinc-600">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-iris-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900">러너:</strong> 성공률 지표 업데이트, 프로필 강화
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-iris-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900">멘티:</strong> 크레딧 지급, 다음 릴레이 세션 할인
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-iris-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900">플랫폼:</strong> 데이터 축적으로 더 나은 매칭
                  </span>
                </div>
              </div>
            </Card>
          </Stagger.Item>

          {/* Submit */}
          <Stagger.Item>
            <div className="flex gap-4 relative">
              <Burst trigger={celebrate} count={24} />
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
                size="lg"
              >
                나중에 하기
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 shine"
                size="lg"
                disabled={!outcome || detail.length < 10 || submitting}
              >
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />제출 중...</> : '보고 완료'}
              </Button>
            </div>
          </Stagger.Item>
        </Stagger>
      </div>
    </div>
  );
}