import { Button } from '../../ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface RecommendationHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export function RecommendationHeader({ title, subtitle, onBack }: RecommendationHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 sticky top-0 z-10">
      <div className="container-web py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
              <Brain className="w-7 h-7 text-iris-600" />
              {title}
            </h1>
            <p className="text-sm text-zinc-600">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
