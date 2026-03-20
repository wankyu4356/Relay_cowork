import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalNav } from './components/GlobalNav';
import type { Category } from './components/GlobalNav';
import { AuthScreen } from './components/AuthScreen';
import { Onboarding } from './components/Onboarding';
import { UnifiedHome } from './components/UnifiedHome';
import { MenteeOnboarding } from './components/MenteeOnboarding';
import { AIExperienceInput } from './components/AIExperienceInput';
import { AIStoryline } from './components/AIStoryline';
import { AIDraftEditor } from './components/AIDraftEditor';
import { AIManagement } from './components/AIManagement';
import { AIRecommendation } from './components/AIRecommendation';
import { MentorSearch } from './components/MentorSearch';
import { MentorProfile } from './components/MentorProfile';
import { MentorNetwork } from './components/MentorNetwork';
import { MentorVerification } from './components/MentorVerification';
import { SessionBooking } from './components/SessionBooking';
import { SessionWorkspace } from './components/SessionWorkspace';
import { SessionList } from './components/SessionList';
import { SessionDetail } from './components/SessionDetail';
import { ReviewWrite } from './components/ReviewWrite';
import { OutcomeReport } from './components/OutcomeReport';
import { MentorDashboard } from './components/MentorDashboard';
import { MentorMenteeList } from './components/MentorMenteeList';
import { MentorReviews } from './components/MentorReviews';
import { MentorEAWizard } from './components/MentorEAWizard';
import { MentorSchedule } from './components/MentorSchedule';
import { MentorRevenue } from './components/MentorRevenue';
import { MentorStats } from './components/MentorStats';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminMentorApproval } from './components/AdminMentorApproval';
import { AdminDisputeManagement } from './components/AdminDisputeManagement';
import { AdminAIServiceManagement } from './components/AdminAIServiceManagement';
import { NotificationCenter } from './components/NotificationCenter';
import { Settings } from './components/Settings';
import { CreditPurchase } from './components/CreditPurchase';
import { MessageCenter } from './components/MessageCenter';
import { BottomNav } from './components/BottomNav';
import { SupabaseHealthCheck } from './components/SupabaseHealthCheck';
import { Toaster } from './components/ui/sonner';
import * as api from './components/api';
import { toast } from 'sonner';
import { CATEGORY_CONTENT } from './lib/categoryContent';

// Screen name to URL path mapping
const screenToPath: Record<string, string> = {
  'auth': '/auth',
  'onboarding': '/onboarding',
  'mentee-onboarding': '/onboarding/mentee',
  'unified-home': '/',
  'ai-experience': '/ai/experience',
  'ai-storyline': '/ai/storyline',
  'ai-draft': '/ai/draft',
  'ai-management': '/ai/management',
  'ai-recommendation': '/ai/recommendation',
  'mentor-search': '/mentors/search',
  'mentor-profile': '/mentors/profile',
  'mentor-network': '/mentors/network',
  'mentor-verification': '/mentors/verification',
  'session-booking': '/sessions/booking',
  'session-workspace': '/sessions/workspace',
  'session-list': '/sessions',
  'session-detail': '/sessions/detail',
  'review-write': '/reviews/write',
  'outcome-report': '/outcomes/report',
  'mentor-dashboard': '/mentor/dashboard',
  'mentor-mentee-list': '/mentor/mentees',
  'mentor-reviews': '/mentor/reviews',
  'mentor-ea-wizard': '/mentor/ea-wizard',
  'mentor-schedule': '/mentor/schedule',
  'mentor-revenue': '/mentor/revenue',
  'mentor-stats': '/mentor/stats',
  'admin-dashboard': '/admin',
  'admin-mentor-approval': '/admin/mentor-approval',
  'admin-dispute-management': '/admin/disputes',
  'admin-ai-service-management': '/admin/ai-service',
  'notifications': '/notifications',
  'settings': '/settings',
  'credit-purchase': '/credits/purchase',
  'message-center': '/messages',
  'chat': '/messages',
};

const pathToScreen: Record<string, string> = Object.fromEntries(
  Object.entries(screenToPath).map(([k, v]) => [v, k])
);

export type Screen = 
  | 'auth'
  | 'onboarding'
  | 'mentee-onboarding'
  | 'unified-home'
  | 'ai-experience'
  | 'ai-storyline'
  | 'ai-draft'
  | 'ai-management'
  | 'ai-recommendation'
  | 'mentor-search'
  | 'mentor-profile'
  | 'mentor-network'
  | 'mentor-verification'
  | 'session-booking'
  | 'session-workspace'
  | 'session-list'
  | 'session-detail'
  | 'review-write'
  | 'outcome-report'
  | 'mentor-dashboard'
  | 'mentor-mentee-list'
  | 'mentor-reviews'
  | 'mentor-ea-wizard'
  | 'mentor-schedule'
  | 'mentor-revenue'
  | 'mentor-stats'
  | 'admin-dashboard'
  | 'admin-mentor-approval'
  | 'admin-dispute-management'
  | 'admin-ai-service-management'
  | 'notifications'
  | 'settings'
  | 'credit-purchase'
  | 'message-center'
  | 'chat';

export type UserRole = 'mentee' | 'mentor' | 'admin';

export interface AIData {
  university: string;
  major: string;
  motivation: string;
  activities: Array<{
    name: string;
    role: string;
    period: string;
    achievement: string;
  }>;
  keywords: string[];
  tone: 'sincere' | 'academic' | 'balanced';
  wordCount: number;
}

export interface Storyline {
  id: string;
  title: string;
  message: string;
  structure: string;
  strength: string;
  materials: string;
}

export interface Mentor {
  id: string;
  name: string;
  university: string;
  major: string;
  year: string;
  rating: number;
  reviews: number;
  sessions: number;
  successRate: number;
  responseTime: string;
  price: number;
  badge: 'gold' | 'silver' | 'bronze';
  verified: boolean;
  avatar: string;
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve initial screen from URL
  const initialScreen = (pathToScreen[location.pathname] || 'auth') as Screen;
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [userRole, setUserRole] = useState<UserRole>('mentee');
  const [selectedCategory, setSelectedCategory] = useState<Category>('transfer');
  const [credits, setCredits] = useState(5);
  const [aiData, setAIData] = useState<AIData | null>(null);
  const [selectedStoryline, setSelectedStoryline] = useState<Storyline | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Auth state
  const [authSession, setAuthSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await api.getSession();
        if (session) {
          setAuthSession(session);
          try {
            const profileData = await api.getProfile();
            setUserProfile(profileData.profile);
            setCredits(profileData.credits ?? 5);

            const role = profileData.profile?.role || 'mentee';
            setUserRole(role as UserRole);

            if (profileData.profile?.onboardingCompleted) {
              if (role === 'mentor') {
                setCurrentScreen('mentor-dashboard');
              } else if (role === 'admin') {
                setCurrentScreen('admin-dashboard');
              } else {
                setCurrentScreen('unified-home');
              }
            } else {
              setCurrentScreen('onboarding');
            }
          } catch (profileErr) {
            // Session exists but profile fetch failed (expired JWT, etc.)
            // Clear stale session and show auth screen
            console.log('Session expired or invalid, clearing:', profileErr);
            await api.signOut();
            setAuthSession(null);
            setCurrentScreen('auth');
          }
        }
      } catch (e) {
        console.log('No existing session:', e);
      } finally {
        setAuthChecked(true);
      }
    };
    checkSession();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const subscription = api.onAuthStateChange((session) => {
      if (!session) {
        setAuthSession(null);
        setUserProfile(null);
        setIsGuest(false);
        setCurrentScreen('auth');
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    const path = screenToPath[screen];
    if (path) {
      navigate(path, { replace: false });
    }
  }, [navigate]);

  const handleAuthSuccess = useCallback(async (session: any, profileData: any) => {
    if (!session) {
      // Guest mode
      setIsGuest(true);
      setUserProfile(profileData.profile);
      setCredits(profileData.credits ?? 5);
      setUserRole((profileData.profile?.role || 'mentee') as UserRole);
      setCurrentScreen('onboarding');
      return;
    }
    
    setAuthSession(session);
    setUserProfile(profileData.profile);
    setCredits(profileData.credits ?? 5);
    
    const role = profileData.profile?.role || 'mentee';
    setUserRole(role as UserRole);

    if (profileData.profile?.onboardingCompleted) {
      if (role === 'mentor') {
        setCurrentScreen('mentor-dashboard');
      } else if (role === 'admin') {
        setCurrentScreen('admin-dashboard');
      } else {
        setCurrentScreen('unified-home');
      }
    } else {
      setCurrentScreen('onboarding');
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (!isGuest) {
        await api.signOut();
      }
      setAuthSession(null);
      setUserProfile(null);
      setIsGuest(false);
      setCurrentScreen('auth');
      toast.success('로그아웃 되었습니다.');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    setUserRole(role);
    
    // Save role to server if authenticated
    if (authSession && !isGuest) {
      try {
        await api.updateProfile({ role });
      } catch (e) {
        console.error('Failed to save role:', e);
      }
    }

    if (role === 'mentee') {
      navigateTo('mentee-onboarding');
    } else if (role === 'mentor') {
      navigateTo('mentor-dashboard');
    } else {
      navigateTo('admin-dashboard');
    }
  };

  const handleOnboardingComplete = async () => {
    // Save onboarding completion
    if (authSession && !isGuest) {
      try {
        await api.updateProfile({ onboardingCompleted: true });
      } catch (e) {
        console.error('Failed to save onboarding status:', e);
      }
    }
    navigateTo('unified-home');
  };

  const handleAISubmit = async (data: AIData) => {
    setAIData(data);

    // Use credit via API
    if (authSession && !isGuest) {
      try {
        const result = await api.useCredit(1);
        setCredits(result.balance);
      } catch (e: any) {
        console.error('Credit use error:', e);
        if (e.message?.includes('부족')) {
          toast.error('크레딧이 부족합니다. 충전해주세요.');
          navigateTo('credit-purchase');
          return;
        }
      }
    } else {
      setCredits(prev => prev - 1);
    }

    navigateTo('ai-storyline');
  };

  const handleStorylineSelect = (storyline: Storyline) => {
    setSelectedStoryline(storyline);
    navigateTo('ai-draft');
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    navigateTo('mentor-profile');
  };

  const handleBookSession = () => {
    navigateTo('session-booking');
  };

  const handleConfirmBooking = async () => {
    // Save session to server
    if (authSession && !isGuest && selectedMentor) {
      try {
        await api.bookSession({
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          mentorAvatar: selectedMentor.avatar,
          date: new Date().toISOString().split('T')[0],
          time: '14:00',
          duration: 60,
          price: selectedMentor.price,
        });
        toast.success('세션이 예약되었습니다!');
      } catch (e) {
        console.error('Session booking error:', e);
      }
    }
    navigateTo('session-workspace');
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    const mentor: Mentor = {
      id: session.mentorId,
      name: session.mentorName,
      avatar: session.mentorAvatar,
      university: '연세대',
      major: '경영학과',
      year: '22학번',
      rating: 4.9,
      reviews: 23,
      sessions: 35,
      successRate: 87,
      responseTime: '2시간',
      price: session.price,
      badge: 'gold',
      verified: true,
    };
    setSelectedMentor(mentor);
    navigateTo('session-workspace');
  };

  const handleReviewWrite = async (session?: Session) => {
    if (!session && selectedSession) {
      session = selectedSession;
    }
    
    if (!session && selectedMentor) {
      navigateTo('review-write');
      return;
    }
    
    if (!session) {
      console.error('No session or mentor available');
      navigateTo('session-list');
      return;
    }
    
    const mentor: Mentor = {
      id: session.mentorId,
      name: session.mentorName,
      avatar: session.mentorAvatar,
      university: '연세대',
      major: '경영학과',
      year: '22학번',
      rating: 4.9,
      reviews: 23,
      sessions: 35,
      successRate: 87,
      responseTime: '2시간',
      price: session.price,
      badge: 'gold',
      verified: true,
    };
    setSelectedMentor(mentor);
    navigateTo('review-write');
  };

  const handleCreditPurchase = async (newCredits: number) => {
    if (authSession && !isGuest) {
      try {
        const result = await api.addCredits(newCredits);
        setCredits(result.balance);
      } catch (e) {
        console.error('Credit purchase error:', e);
        setCredits(prev => prev + newCredits);
      }
    } else {
      setCredits(prev => prev + newCredits);
    }
  };

  // Save draft handler for AIDraftEditor
  const handleSaveDraft = async (content: string) => {
    if (authSession && !isGuest && aiData) {
      try {
        await api.createDraft({
          university: aiData.university,
          major: aiData.major,
          content,
          storyline: selectedStoryline,
          aiData,
        });
        toast.success('초안이 저장되었습니다!');
      } catch (e) {
        console.error('Draft save error:', e);
        toast.error('초안 저장에 실패했습니다.');
      }
    }
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (currentScreen === 'auth') {
    return (
      <>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  const isAuthScreen = currentScreen === 'onboarding' || currentScreen === 'mentee-onboarding';

  return (
    <div className="min-h-screen gradient-mesh">
      <GlobalNav 
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onRoleChange={(role) => setUserRole(role)}
        currentRole={userRole}
        unreadMessages={2}
        unreadNotifications={3}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isAuthScreen
            ? '0' 
            : sidebarCollapsed ? '80px' : '288px',
        }}
      >
        {currentScreen === 'onboarding' && (
          <Onboarding onComplete={handleRoleSelect} />
        )}
        
        {currentScreen === 'mentee-onboarding' && (
          <MenteeOnboarding 
            onComplete={handleOnboardingComplete}
          />
        )}
        
        {currentScreen === 'unified-home' && (
          <UnifiedHome
            onNavigate={navigateTo}
            onMentorSelect={handleMentorSelect}
            credits={credits}
            isMentorActive={false}
            selectedCategory={selectedCategory}
          />
        )}
        
        {currentScreen === 'ai-experience' && (
          <AIExperienceInput
            onBack={() => navigateTo('unified-home')}
            onSubmit={handleAISubmit}
            credits={credits}
            selectedCategory={selectedCategory}
          />
        )}
        
        {currentScreen === 'ai-storyline' && aiData && (
          <AIStoryline 
            onBack={() => navigateTo('ai-experience')}
            onSelect={handleStorylineSelect}
            aiData={aiData}
          />
        )}
        
        {currentScreen === 'ai-draft' && selectedStoryline && aiData && (
          <AIDraftEditor 
            onBack={() => navigateTo('ai-storyline')}
            onMentorConnect={() => navigateTo('mentor-search')}
            onManage={() => navigateTo('ai-management')}
            storyline={selectedStoryline}
            aiData={aiData}
          />
        )}
        
        {currentScreen === 'ai-management' && (
          <AIManagement 
            onBack={() => navigateTo('unified-home')}
            onEdit={(data) => {
              setAIData(data);
              if (!selectedStoryline) {
                setSelectedStoryline({
                  id: 'edit-default',
                  title: `${data.university} ${data.major} ${CATEGORY_CONTENT[selectedCategory].label}`,
                  message: '기존 초안을 기반으로 편집합니다',
                  structure: '기존 구조 유지',
                  strength: '기존 강점 활용',
                  materials: '기존 자료 활용',
                });
              }
              navigateTo('ai-draft');
            }}
            onMentorConnect={() => navigateTo('mentor-search')}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'ai-recommendation' && (
          <AIRecommendation 
            onBack={() => navigateTo('unified-home')}
            onComplete={() => navigateTo('mentor-search')}
          />
        )}
        
        {currentScreen === 'mentor-search' && (
          <MentorSearch
            onBack={() => navigateTo('unified-home')}
            onMentorSelect={handleMentorSelect}
            onNavigate={navigateTo}
            selectedCategory={selectedCategory}
          />
        )}
        
        {currentScreen === 'mentor-profile' && selectedMentor && (
          <MentorProfile 
            onBack={() => navigateTo('mentor-search')}
            onBook={handleBookSession}
            mentor={selectedMentor}
            networkDistance={1}
            connectionPath={['나', selectedMentor.name]}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'mentor-network' && (
          <MentorNetwork 
            onBack={() => navigateTo('mentor-search')}
            onMentorSelect={handleMentorSelect}
            onStartMentoring={() => navigateTo('mentor-verification')}
          />
        )}
        
        {currentScreen === 'mentor-verification' && (
          <MentorVerification 
            onBack={() => navigateTo('unified-home')}
            onComplete={() => navigateTo('unified-home')}
          />
        )}
        
        {currentScreen === 'session-booking' && selectedMentor && (
          <SessionBooking 
            onBack={() => navigateTo('mentor-profile')}
            onConfirm={handleConfirmBooking}
            mentor={selectedMentor}
          />
        )}
        
        {currentScreen === 'session-workspace' && (
          <SessionWorkspace 
            onBack={() => navigateTo('session-detail')}
            onComplete={() => handleReviewWrite()}
            mentor={{
              id: '1',
              name: '러너 A',
              avatar: '👨‍🎓',
              university: '연세대',
              major: '경영학과',
              year: 2023,
              rating: 4.9,
              reviewCount: 45,
              totalSessions: 156,
              isVerified: true,
              responseTime: '2시간 이내',
              expertise: ['학업계획서', '자기소개서', '면접 준비']
            }}
          />
        )}
        
        {currentScreen === 'session-list' && (
          <SessionList 
            onBack={() => navigateTo('unified-home')}
            onSessionSelect={handleSessionSelect}
            onReviewWrite={handleReviewWrite}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'session-detail' && (
          <SessionDetail 
            onBack={() => navigateTo('mentor-dashboard')}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'review-write' && selectedMentor && (
          <ReviewWrite 
            onBack={() => navigateTo('session-list')}
            onSubmit={() => navigateTo('unified-home')}
            mentor={selectedMentor}
          />
        )}
        
        {currentScreen === 'outcome-report' && selectedMentor && (
          <OutcomeReport 
            onBack={() => navigateTo('unified-home')}
            onSubmit={(outcome, detail) => {
              console.log('Outcome:', outcome, detail);
              navigateTo('unified-home');
            }}
            mentor={selectedMentor}
            purpose={`${aiData?.university || ''} ${aiData?.major || ''} ${CATEGORY_CONTENT[selectedCategory].label}`}
          />
        )}
        
        {currentScreen === 'mentor-dashboard' && (
          <MentorDashboard 
            onNavigate={navigateTo}
            onRoleChange={(role) => {
              setUserRole(role);
            }}
          />
        )}
        
        {currentScreen === 'mentor-mentee-list' && (
          <MentorMenteeList 
            onBack={() => navigateTo('mentor-dashboard')}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'mentor-reviews' && (
          <MentorReviews 
            onBack={() => navigateTo('mentor-dashboard')}
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'mentor-ea-wizard' && (
          <MentorEAWizard 
            onBack={() => navigateTo('mentor-dashboard')}
            onComplete={() => navigateTo('mentor-dashboard')}
          />
        )}
        
        {currentScreen === 'mentor-schedule' && (
          <MentorSchedule 
            onBack={() => navigateTo('mentor-dashboard')}
          />
        )}
        
        {currentScreen === 'mentor-revenue' && (
          <MentorRevenue 
            onBack={() => navigateTo('mentor-dashboard')}
          />
        )}
        
        {currentScreen === 'mentor-stats' && (
          <MentorStats 
            onBack={() => navigateTo('mentor-dashboard')}
          />
        )}
        
        {currentScreen === 'admin-dashboard' && (
          <AdminDashboard 
            onNavigate={navigateTo}
          />
        )}
        
        {currentScreen === 'admin-mentor-approval' && (
          <AdminMentorApproval 
            onBack={() => navigateTo('admin-dashboard')}
          />
        )}
        
        {currentScreen === 'admin-dispute-management' && (
          <AdminDisputeManagement 
            onBack={() => navigateTo('admin-dashboard')}
          />
        )}
        
        {currentScreen === 'admin-ai-service-management' && (
          <AdminAIServiceManagement 
            onBack={() => navigateTo('admin-dashboard')}
          />
        )}
        
        {currentScreen === 'notifications' && (
          <NotificationCenter 
            onBack={() => {
              if (userRole === 'mentee') navigateTo('unified-home');
              else if (userRole === 'mentor') navigateTo('mentor-dashboard');
              else navigateTo('admin-dashboard');
            }}
          />
        )}
        
        {currentScreen === 'settings' && (
          <Settings 
            onBack={() => {
              if (userRole === 'mentee') navigateTo('unified-home');
              else if (userRole === 'mentor') navigateTo('mentor-dashboard');
              else navigateTo('admin-dashboard');
            }}
            credits={credits}
            isMentorActive={false}
          />
        )}
        
        {currentScreen === 'credit-purchase' && (
          <CreditPurchase 
            onBack={() => {
              if (userRole === 'mentee') navigateTo('unified-home');
              else if (userRole === 'mentor') navigateTo('mentor-dashboard');
              else navigateTo('admin-dashboard');
            }}
            currentCredits={credits}
            onPurchaseComplete={handleCreditPurchase}
          />
        )}
        
        {currentScreen === 'message-center' && (
          <MessageCenter 
            onBack={() => {
              if (userRole === 'mentee') navigateTo('unified-home');
              else if (userRole === 'mentor') navigateTo('mentor-dashboard');
              else navigateTo('admin-dashboard');
            }}
          />
        )}
        
        {currentScreen === 'chat' && (
          <MessageCenter 
            onBack={() => {
              if (userRole === 'mentee') navigateTo('unified-home');
              else if (userRole === 'mentor') navigateTo('mentor-dashboard');
              else navigateTo('admin-dashboard');
            }}
          />
        )}
        {userRole === 'mentee' && !(isAuthScreen) && (
          <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
        )}
        <Toaster />
      </div>
    </div>
  );
}

export default App;