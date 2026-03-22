import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getSupabase } from './api';
import { logger } from '../utils/logger';

interface SupabaseHealthCheckProps {
  onHealthy?: () => void;
}

export function SupabaseHealthCheck({ onHealthy }: SupabaseHealthCheckProps) {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retrying, setRetrying] = useState(false);

  const checkHealth = async () => {
    setStatus('checking');
    setErrorMessage('');

    try {
      logger.log('Checking Supabase connection...');
      const sb = getSupabase();
      
      // Try to get session (this will test the connection)
      const { data, error } = await sb.auth.getSession();
      
      if (error && error.message.includes('Failed to fetch')) {
        throw new Error('Supabase 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      }
      
      logger.log('Supabase connection successful');
      setStatus('healthy');
      onHealthy?.();
    } catch (err: any) {
      logger.error('Supabase health check failed:', err);
      setStatus('error');
      setErrorMessage(err.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    await checkHealth();
    setTimeout(() => setRetrying(false), 1000);
  };

  if (status === 'healthy') {
    return null;
  }

  return (
    <AnimatePresence>
      {(status === 'checking' || status === 'error') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <Card className="max-w-md w-full p-6 bg-white/95 backdrop-blur-md border-2">
              <div className="text-center space-y-4">
                {status === 'checking' ? (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw className="w-8 h-8 text-sky-600" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">연결 확인 중...</h3>
                    <p className="text-gray-600">Supabase 서버와 연결을 확인하고 있습니다.</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                      <WifiOff className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">연결 실패</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800 text-left">
                          <p className="font-semibold mb-1">Supabase 프로젝트에 연결할 수 없습니다</p>
                          <p className="text-red-700">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-left space-y-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-gray-900">해결 방법:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>인터넷 연결을 확인해주세요</li>
                        <li>Supabase 프로젝트가 활성화되어 있는지 확인해주세요</li>
                        <li>프로젝트 ID와 Anon Key가 올바른지 확인해주세요</li>
                        <li>잠시 후 다시 시도해주세요</li>
                      </ul>
                    </div>
                    <Button
                      onClick={handleRetry}
                      disabled={retrying}
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    >
                      {retrying ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          재시도 중...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          다시 시도
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
