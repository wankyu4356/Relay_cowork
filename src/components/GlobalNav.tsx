import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Home,
  Sparkles,
  Route,
  Calendar,
  MessageCircle,
  Settings,
  Bell,
  Menu,
  X,
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  Award,
  Star,
  GraduationCap,
  Repeat,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Screen } from '../App';

interface GlobalNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onRoleChange?: (role: 'mentee' | 'mentor') => void;
  currentRole?: 'mentee' | 'mentor';
  unreadMessages?: number;
  unreadNotifications?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  selectedCategory?: Category;
  onCategoryChange?: (category: Category) => void;
}

export type Category = 'transfer' | 'admission' | 'career' | 'certification' | 'other';

interface CategoryConfig {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}

const categories: CategoryConfig[] = [
  {
    id: 'transfer',
    label: '편입',
    icon: BookOpen,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    description: '대학 편입 준비',
  },
  {
    id: 'admission',
    label: '입시',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '정시/수시 입시',
  },
  {
    id: 'career',
    label: '취업',
    icon: Briefcase,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    description: '인턴/이직',
  },
  {
    id: 'certification',
    label: '자격증',
    icon: Award,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    description: '자격증/공모전',
  },
  {
    id: 'other',
    label: '기타',
    icon: Star,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: '다양한 경험',
  },
];

export function GlobalNav({
  currentScreen,
  onNavigate,
  onRoleChange,
  currentRole = 'mentee',
  unreadMessages = 0,
  unreadNotifications = 3,
  collapsed = false,
  onToggleCollapse,
  selectedCategory = 'transfer',
  onCategoryChange,
}: GlobalNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const handleRoleSwitch = () => {
    const newRole = currentRole === 'mentee' ? 'mentor' : 'mentee';
    onRoleChange?.(newRole);
    if (newRole === 'mentor') {
      onNavigate('mentor-dashboard');
    } else {
      onNavigate('unified-home');
    }
  };

  const handleCategoryChange = (category: Category) => {
    onCategoryChange?.(category);
    setShowCategoryMenu(false);
    onNavigate('unified-home');
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const CategoryIcon = currentCategory?.icon || BookOpen;

  // Mobile menu only when not on home
  const showMobileNav = currentScreen !== 'onboarding' && currentScreen !== 'mentee-onboarding' && currentScreen !== 'auth';

  if (!showMobileNav) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        animate={{ width: collapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-20 overflow-hidden"
        role="navigation"
        aria-label="사이드바 네비게이션"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Category & Toggle Button */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              {!collapsed && (
                <button
                  onClick={() => onNavigate('unified-home')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Repeat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">릴레이</h1>
                    <p className="text-xs text-gray-500">경험 릴레이 플랫폼</p>
                  </div>
                </button>
              )}
              {collapsed && (
                <button
                  onClick={() => onNavigate('unified-home')}
                  className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mx-auto hover:opacity-80 transition-opacity"
                >
                  <Repeat className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
            
            {/* Toggle Button - Always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={`w-full hover:bg-gray-100 rounded-lg p-2 flex items-center ${collapsed ? 'justify-center' : 'justify-end'}`}
              aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
              aria-expanded={!collapsed}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>

            {!collapsed && (
              <>
                {/* Category Selector */}
                <div className="relative mt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl border-2 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    aria-expanded={showCategoryMenu}
                    aria-label="카테고리 선택"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${currentCategory?.bgColor} rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`w-4 h-4 ${currentCategory?.color}`} />
                      </div>
                      <span className="font-semibold">{currentCategory?.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showCategoryMenu ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </Button>

                  {/* Category Dropdown */}
                  <AnimatePresence>
                    {showCategoryMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
                      >
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => handleCategoryChange(category.id)}
                              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left cursor-pointer ${
                                category.id === selectedCategory ? 'bg-sky-50' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${category.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">{category.label}</span>
                                </div>
                                <p className="text-xs text-gray-600">{category.description}</p>
                              </div>
                              {category.id === selectedCategory && (
                                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              <NavItem
                icon={Home}
                label="홈"
                active={currentScreen === 'unified-home' || currentScreen === 'mentor-dashboard'}
                onClick={() => currentRole === 'mentee' ? onNavigate('unified-home') : onNavigate('mentor-dashboard')}
                collapsed={collapsed}
                activeColor="text-sky-700"
                activeBg="from-sky-50 to-sky-50"
                hoverBg="hover:bg-sky-50"
              />
              {currentRole === 'mentee' && (
                <NavItem
                  icon={Sparkles}
                  label="AI 바통"
                  active={currentScreen === 'ai-experience' || currentScreen === 'ai-management'}
                  onClick={() => onNavigate('ai-management')}
                  badge={2}
                  collapsed={collapsed}
                  activeColor="text-violet-600"
                  activeBg="from-violet-50 to-violet-50"
                  hoverBg="hover:bg-violet-50"
                />
              )}
              <NavItem
                icon={Route}
                label={currentRole === 'mentee' ? '릴레이 러너' : '내 러너'}
                active={currentScreen === 'mentor-search' || currentScreen === 'mentor-network' || currentScreen === 'mentor-mentee-list'}
                onClick={() => currentRole === 'mentee' ? onNavigate('mentor-search') : onNavigate('mentor-mentee-list')}
                collapsed={collapsed}
                activeColor="text-emerald-600"
                activeBg="from-emerald-50 to-emerald-50"
                hoverBg="hover:bg-emerald-50"
              />
              <NavItem
                icon={Calendar}
                label={currentRole === 'mentee' ? '릴레이 세션' : '릴레이 관리'}
                active={currentScreen === 'session-list' || currentScreen === 'session-detail'}
                onClick={() => currentRole === 'mentee' ? onNavigate('session-list') : onNavigate('session-detail')}
                badge={3}
                collapsed={collapsed}
                activeColor="text-indigo-600"
                activeBg="from-indigo-50 to-indigo-50"
                hoverBg="hover:bg-indigo-50"
              />
              <NavItem
                icon={MessageCircle}
                label="릴레이 톡"
                active={currentScreen === 'message-center' || currentScreen === 'chat'}
                onClick={() => onNavigate('message-center')}
                badge={unreadMessages}
                collapsed={collapsed}
                activeColor="text-teal-600"
                activeBg="from-teal-50 to-teal-50"
                hoverBg="hover:bg-teal-50"
              />
            </div>

            {/* Role Switch */}
            {!collapsed && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 rounded-xl border-2 hover:border-sky-300 hover:bg-sky-50 transition-all"
                  onClick={handleRoleSwitch}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold">
                      {currentRole === 'mentee' ? '바통 넘기기' : '바통 받기'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentRole === 'mentee' ? '러너로 전환' : '멘티로 전환'}
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <NavItem
              icon={Bell}
              label="알림"
              active={currentScreen === 'notifications'}
              onClick={() => onNavigate('notifications')}
              badge={unreadNotifications}
              collapsed={collapsed}
            />
            <NavItem
              icon={Settings}
              label="설정"
              active={currentScreen === 'settings'}
              onClick={() => onNavigate('settings')}
              collapsed={collapsed}
            />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom" role="navigation" aria-label="메인 네비게이션">
        <div className="grid grid-cols-5 h-16">
          <MobileNavItem
            icon={Home}
            label="홈"
            active={currentScreen === 'unified-home'}
            onClick={() => onNavigate('unified-home')}
            activeColor="text-sky-600"
          />
          <MobileNavItem
            icon={Sparkles}
            label="AI 바통"
            active={currentScreen === 'ai-experience' || currentScreen === 'ai-management'}
            onClick={() => onNavigate('ai-management')}
            badge={2}
            activeColor="text-violet-600"
          />
          <MobileNavItem
            icon={Route}
            label="러너"
            active={currentScreen === 'mentor-search' || currentScreen === 'mentor-network'}
            onClick={() => onNavigate('mentor-search')}
            activeColor="text-emerald-600"
          />
          <MobileNavItem
            icon={Calendar}
            label="릴레이"
            active={currentScreen === 'session-list'}
            onClick={() => onNavigate('session-list')}
            badge={3}
            activeColor="text-indigo-600"
          />
          <MobileNavItem
            icon={Menu}
            label="메뉴"
            active={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
            badge={unreadNotifications}
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Repeat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold gradient-text">릴레이</h2>
                      <p className="text-xs text-gray-500">경험 릴레이 플랫폼</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="메뉴 닫기"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Category Selector Mobile */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">카테고리</p>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategoryChange(category.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full p-3 flex items-center gap-3 rounded-xl transition-colors ${
                            category.id === selectedCategory
                              ? 'bg-sky-50 border-2 border-sky-200'
                              : 'bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{category.label}</span>
                            </div>
                            <p className="text-xs text-gray-600">{category.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-1">
                  <NavItem
                    icon={MessageCircle}
                    label="릴레이 톡"
                    active={currentScreen === 'message-center' || currentScreen === 'chat'}
                    onClick={() => {
                      onNavigate('message-center');
                      setIsMobileMenuOpen(false);
                    }}
                    badge={unreadMessages}
                    activeColor="text-teal-600"
                    activeBg="from-teal-50 to-teal-50"
                    hoverBg="hover:bg-teal-50"
                  />
                  <NavItem
                    icon={Bell}
                    label="알림"
                    active={currentScreen === 'notifications'}
                    onClick={() => {
                      onNavigate('notifications');
                      setIsMobileMenuOpen(false);
                    }}
                    badge={unreadNotifications}
                  />
                  <NavItem
                    icon={Settings}
                    label="설정"
                    active={currentScreen === 'settings'}
                    onClick={() => {
                      onNavigate('settings');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </div>

                {/* Role Switch Mobile */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-14 rounded-xl border-2 hover:border-sky-300"
                    onClick={() => {
                      handleRoleSwitch();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-lg flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">
                        {currentRole === 'mentee' ? '바통 넘기기' : '바통 받기'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentRole === 'mentee' ? '러너로 전환' : '멘티로 전환'}
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-72" />
    </>
  );
}

// Desktop Nav Item
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
  collapsed?: boolean;
  activeColor?: string;
  activeBg?: string;
  hoverBg?: string;
}

function NavItem({ icon: Icon, label, active, onClick, badge, collapsed, activeColor = 'text-sky-700', activeBg = 'from-sky-50 to-sky-50', hoverBg = 'hover:bg-sky-50' }: NavItemProps) {
  if (collapsed) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${
          active
            ? `bg-gradient-to-r ${activeBg} ${activeColor} font-semibold shadow-sm`
            : `text-gray-700 hover:bg-gray-50`
        }`}
        title={label}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
      >
        <div className="relative">
          <Icon className="w-5 h-5" />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? `bg-gradient-to-r ${activeBg} ${activeColor} font-semibold shadow-sm`
          : `text-gray-700 ${hoverBg}`
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <div className="relative">
        <Icon className="w-5 h-5" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="flex-1 text-left text-sm">{label}</span>
    </button>
  );
}

// Mobile Nav Item
function MobileNavItem({ icon: Icon, label, active, onClick, badge, activeColor = 'text-sky-600' }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all ${
        active ? activeColor : 'text-gray-600'
      }`}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {badge > 9 ? '9' : badge}
          </span>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}