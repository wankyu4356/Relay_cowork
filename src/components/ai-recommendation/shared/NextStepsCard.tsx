import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Sparkles, Award } from 'lucide-react';

interface NextStepsCardProps {
  steps: Array<{ title: string; description: string }>;
  ctaText?: string;
  onComplete?: () => void;
}

export function NextStepsCard({
  steps,
  ctaText = '경험 전달자 찾으러 가기',
  onComplete,
}: NextStepsCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-green-600" />
        다음 단계
      </h3>
      <div className="space-y-3 mb-6">
        {steps.map((nextStep, index) => (
          <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">{nextStep.title}</div>
              <div className="text-sm text-gray-600">{nextStep.description}</div>
            </div>
          </div>
        ))}
      </div>
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-xl py-6 text-lg"
        onClick={onComplete}
      >
        <Award className="w-5 h-5 mr-2" />
        {ctaText}
      </Button>
    </Card>
  );
}
