import { CheckCircle, Circle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface ProfileCompletionProps {
  hasPhoto?: boolean;
  hasEducation?: boolean;
  hasWork?: boolean;
  hasVerification?: boolean;
  verificationLevel?: 'none' | 'email' | 'document' | 'platform';
}

export function ProfileCompletion({
  hasPhoto = false,
  hasEducation = false,
  hasWork = false,
  hasVerification = false,
  verificationLevel = 'none'
}: ProfileCompletionProps) {
  
  const completionItems = [
    { label: '프로필 사진', completed: hasPhoto, weight: 20 },
    { label: '학력 정보', completed: hasEducation, weight: 30 },
    { label: '경력 정보', completed: hasWork, weight: 30 },
    { label: '인증 완료', completed: hasVerification, weight: 20 },
  ];

  const totalCompletion = completionItems.reduce(
    (sum, item) => sum + (item.completed ? item.weight : 0),
    0
  );

  const getVerificationBadge = () => {
    switch (verificationLevel) {
      case 'email':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            ✓ Email Verified
          </Badge>
        );
      case 'document':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            ✓ Document Verified
          </Badge>
        );
      case 'platform':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
            ✓ Platform Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">프로필 완성도</h3>
        <span className="text-2xl font-bold text-sky-600">{totalCompletion}%</span>
      </div>

      <Progress value={totalCompletion} className="mb-4" />

      <div className="space-y-2 mb-4">
        {completionItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            {item.completed ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
            <span className={item.completed ? 'text-gray-900' : 'text-gray-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {verificationLevel !== 'none' && (
        <div className="pt-4 border-t">
          {getVerificationBadge()}
        </div>
      )}

      {totalCompletion < 100 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700">
          💡 프로필 완성도가 높을수록 검색 결과에서 상위 노출됩니다
        </div>
      )}
    </Card>
  );
}
