// Supabase 연결 정보는 환경변수에서 읽습니다.
// 로컬: 프로젝트 루트 .env 파일 / 배포: Vercel 환경변수
//   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
//   VITE_SUPABASE_ANON_KEY=<anon public key>
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Extract projectId from URL (https://<ref>.supabase.co → <ref>)
export const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
export const publicAnonKey = supabaseAnonKey;
