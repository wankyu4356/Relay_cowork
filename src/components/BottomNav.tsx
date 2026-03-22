import { Home, FileText, Calendar, MessageSquare, User, Users } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isMentorActive?: boolean; // 멘토 기능 활성화 여부
}

export function BottomNav({ currentScreen, onNavigate, isMentorActive = false }: BottomNavProps) {
  const isActive = (screen: Screen) => currentScreen === screen;

  const navItems = [
    { screen: 'unified-home' as Screen, icon: Home, label: '홈' },
    { screen: 'ai-management' as Screen, icon: FileText, label: 'AI' },
    { screen: 'mentor-search' as Screen, icon: Users, label: '러너' },
    { screen: 'session-list' as Screen, icon: Calendar, label: '세션' },
    { screen: 'settings' as Screen, icon: User, label: '내 정보' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-bottom" role="navigation" aria-label="메인 네비게이션">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.screen);

          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? 'text-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'fill-sky-100' : ''}`} />
              <span className={`text-xs ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}