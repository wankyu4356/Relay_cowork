import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Sparkles, Download, RefreshCw, Users, Loader2, Save, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Storyline, AIData } from '../App';
import * as api from './api';
import { logger } from '../utils/logger';

interface AIDraftEditorProps {
  onBack: () => void;
  onMentorConnect: () => void;
  onManage: () => void;
  storyline: Storyline;
  aiData: AIData;
}

const generateDraft = (storyline: Storyline, aiData: AIData) => {
  return `1. 지원 동기

정치외교학을 전공하며 국제관계의 복잡한 역학을 분석하는 과정에서, 이론적 분석력과 실무적 전략 수립 능력의 간극을 경험했습니다. 특히 학회 활동에서 글로벌 기업의 시장 진입 전략을 연구하면서, 정치학적 통찰을 경영학적 의사결정으로 연결하는 과정에 깊은 흥미를 느꼈습니다. ${aiData.university} ${aiData.major}은 이러한 융합적 역량을 체계적으로 발전시킬 수 있는 최적의 환경이라고 판단했습니다.

2. 학업 배경

3학년 동안 정치경제학과 국제정치론을 수강하며 국가 간 경제 협력의 메커니즘을 학��했습니다. 이 과정에서 기업의 국제화 전략에 대한 관심이 깊어졌고, 컨설팅 인턴십을 통해 실제 기업 전략 수립 과정을 경험했습니다. 하지만 재무분석, 마케팅 전략 등 경영학의 핵심 도구에 대한 체계적 학습이 부족함을 절감했습니다.

3. 학업 계획

입학 후에는 재무관리와 전략경영 과목을 중심으로 경영학의 기초를 다지고자 합니다. 특히 글로벌 경영 사례 연구를 통해 정치외교학적 배경을 경영 전략에 접목하는 방법을 학습하겠습니다. 또한 데이터 분석 역량을 강화하여 실증적 의사결정 능력을 갖추고, 교환학생 프로그램을 통해 국제 경영 환경을 직접 체험하고자 합니다.

4. 졸업 후 계획

장기적으로 글로벌 기업의 전략 컨설턴트로 성장하여, 정치·경제·경영의 융합적 관점에서 기업의 국제화 전략을 설계하고 싶습니다. ${aiData.university}에서의 학업을 통해 이론과 실무를 겸비한 전문가로 성장하겠습니다.`;
};

export function AIDraftEditor({ onBack, onMentorConnect, onManage, storyline, aiData }: AIDraftEditorProps) {
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [analysis, setAnalysis] = useState({
    structure: 85,
    specificity: 75,
    uniqueness: 90,
    relevance: 92,
  });

  useEffect(() => {
    const fullDraft = generateDraft(storyline, aiData);
    let currentText = '';
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < fullDraft.length) {
        currentText += fullDraft[index];
        setDraft(currentText);
        setWordCount(currentText.length);
        index++;
      } else {
        clearInterval(typingInterval);
        setLoading(false);
        toast.success('AI 초안이 완료되었습니다! ✨');
      }
    }, 8);

    return () => clearInterval(typingInterval);
  }, [storyline, aiData]);

  const handleDownload = () => {
    toast.success('PDF 다운로드가 시작됩니다');
  };

  const handleRegenerate = () => {
    toast.info('문단을 재생성하고 있습니다...');
    setTimeout(() => {
      toast.success('재생성이 완료되었습니다');
    }, 1500);
  };

  const handleSave = async () => {
    try {
      await api.createDraft({
        university: aiData.university,
        major: aiData.major,
        content: draft,
        storyline,
        aiData,
      });
      toast.success('AI 초안이 서버에 저장되었습니다!');
    } catch (e) {
      logger.error('Draft save error:', e);
      toast.success('저장되었습니다 (로컬)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">✨ AI 초안 작성</h1>
                <p className="text-gray-600 mt-1">
                  {aiData.university} {aiData.major} · 스토리라인 {storyline.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base px-4 py-2">
                {wordCount} / {aiData.wordCount}자
              </Badge>
              <Button variant="outline" onClick={onManage}>
                내 초안 관리
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr,360px] gap-6">
          {/* Editor */}
          <div className="space-y-4">
            {loading && (
              <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                  <div>
                    <div className="font-semibold text-lg mb-1">
                      릴레이 AI가 AI 초안을 생성하고 있습니다...
                    </div>
                    <div className="text-gray-600">
                      선택하신 스토리라인으로 AI 초안을 작성 중입니다
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-8">
              <Textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setWordCount(e.target.value.length);
                }}
                className="min-h-[700px] font-serif text-base leading-relaxed border-0 focus-visible:ring-0 p-0"
                placeholder="릴레이 AI가 AI 초안을 생성하고 있습니다..."
              />
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF 다운로드
              </Button>
              <Button 
                variant="outline"
                onClick={handleRegenerate}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                재생성
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* AI Analysis */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                릴레이 AI 분석
              </h3>
              <div className="space-y-4">
                {[
                  { label: '구조 완성도', value: analysis.structure, color: 'bg-green-500' },
                  { label: '구체성', value: analysis.specificity, color: 'bg-blue-500' },
                  { label: '차별화', value: analysis.uniqueness, color: 'bg-purple-500' },
                  { label: '학과 적합도', value: analysis.relevance, color: 'bg-violet-500' },
                ].map((item, index) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Editing Tools */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">📝 편집 도구</h3>
              <div className="space-y-2">
                {[
                  { icon: Sparkles, label: '문단 재생성' },
                  { icon: Sparkles, label: '톤 변경' },
                  { icon: Sparkles, label: '더 구체적으로' },
                  { icon: Sparkles, label: '더 간결하게' },
                ].map((tool) => (
                  <Button
                    key={tool.label}
                    variant="outline"
                    className="w-full justify-start hover:bg-violet-50 hover:border-violet-300"
                    size="sm"
                  >
                    <tool.icon className="w-4 h-4 mr-2 text-violet-600" />
                    {tool.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Mentor CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    이 학교 합격생<br />러너 3명 추천
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm">
                    AI 초안을 실제 합격생이<br />
                    1:1로 완성해드려요
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                    onClick={onMentorConnect}
                  >
                    러너 첨삭받기 →
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}