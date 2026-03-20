import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Brain } from 'lucide-react';

interface AnalyzingAnimationProps {
  message?: string;
  description?: string;
  steps: string[];
}

export function AnalyzingAnimation({
  message = 'AI 분석 중...',
  description = '입력하신 정보를 바탕으로\n최적의 결과를 찾고 있습니다',
  steps,
}: AnalyzingAnimationProps) {
  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center justify-center min-h-[600px]"
    >
      <Card className="p-12 text-center max-w-md">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity },
          }}
          className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold gradient-text mb-3">{message}</h2>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          {steps.map((stepText, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.5 }}
            >
              {stepText}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
