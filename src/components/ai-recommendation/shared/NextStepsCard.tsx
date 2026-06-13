import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Sparkles, Award } from 'lucide-react';
import { Stagger } from '../../ui/motion';

interface NextStepsCardProps {
  steps: Array<{ title: string; description: string }>;
  ctaText?: string;
  onComplete?: () => void;
}

export function NextStepsCard({
  steps,
  ctaText = '릴레이 러너 찾으러 가기',
  onComplete,
}: NextStepsCardProps) {
  return (
    <Card className="p-6 bg-white border-zinc-200/80">
      <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-iris-600" />
        다음 단계
      </h3>
      <Stagger className="space-y-3 mb-6">
        {steps.map((nextStep, index) => (
          <Stagger.Item key={index} className="flex items-start gap-3 bg-zinc-50 border border-zinc-200/80 p-4 rounded-xl">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 tnum">
              {index + 1}
            </div>
            <div>
              <div className="font-semibold text-zinc-900 mb-1">{nextStep.title}</div>
              <div className="text-sm text-zinc-600">{nextStep.description}</div>
            </div>
          </Stagger.Item>
        ))}
      </Stagger>
      <Button
        size="lg"
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl py-6 text-lg"
        onClick={onComplete}
      >
        <Award className="w-5 h-5 mr-2" />
        {ctaText}
      </Button>
    </Card>
  );
}
