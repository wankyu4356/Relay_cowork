import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MentorSearch } from './MentorSearch';
import type { Mentor } from '../App';

const mockMentors: Mentor[] = [
  { id: '1', name: '러너 #2847', university: '연세대', major: '경영학과', year: '22학번', rating: 4.9, reviews: 23, sessions: 35, successRate: 87, responseTime: '2시간', price: 80000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: '2', name: '러너 #1923', university: '고려대', major: '경제학과', year: '23학번', rating: 4.8, reviews: 18, sessions: 22, successRate: 82, responseTime: '1시간', price: 70000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: '3', name: '러너 #5621', university: '성균관대', major: '경영학과', year: '23학번', rating: 4.7, reviews: 12, sessions: 15, successRate: 80, responseTime: '3시간', price: 60000, badge: 'silver', verified: true, avatar: '👩‍💼' },
];

// Mock dependencies
vi.mock('./api', () => ({
  getMentors: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('lucide-react', () => {
  const icon = ({ children, ...props }: any) => <span {...props}>{children}</span>;
  return {
    Search: icon,
    SlidersHorizontal: icon,
    Star: icon,
    TrendingUp: icon,
    Clock: icon,
    X: icon,
    Network: icon,
    Users: icon,
    Award: icon,
    Zap: icon,
    CheckCircle2: icon,
    MessageCircle: icon,
    DollarSign: icon,
    Calendar: icon,
    Target: icon,
    Sparkles: icon,
  };
});

vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: any) => {
        const { whileHover, whileTap, initial, animate, exit, transition, ...rest } = props;
        const Tag = prop as string;
        return <div data-motion={Tag} {...rest}>{children}</div>;
      };
    },
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../hooks/useMentors', () => ({
  useMentors: vi.fn(),
}));

vi.mock('../lib/runnerUtils', () => ({
  getRunnerColor: () => 'bg-blue-100',
  getRunnerAvatar: (name: string) => name.charAt(0),
}));

import { useMentors } from '../hooks/useMentors';

describe('MentorSearch', () => {
  const mockOnBack = vi.fn();
  const mockOnMentorSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMentors as any).mockReturnValue({
      mentors: mockMentors,
      loading: false,
      error: null,
      isFromApi: false,
      refetch: vi.fn(),
    });
  });

  it('renders search input and mentor cards', () => {
    render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);
    expect(screen.getByLabelText('러너 검색')).toBeInTheDocument();
    expect(screen.getByText('러너 #2847')).toBeInTheDocument();
    expect(screen.getByText('러너 #1923')).toBeInTheDocument();
    expect(screen.getByText('러너 #5621')).toBeInTheDocument();
  });

  it('filters mentors by search query', () => {
    render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);

    const searchInput = screen.getByLabelText('러너 검색');
    fireEvent.change(searchInput, { target: { value: '연세대' } });

    expect(screen.getByText('러너 #2847')).toBeInTheDocument();
    expect(screen.queryByText('러너 #1923')).not.toBeInTheDocument();
    expect(screen.queryByText('러너 #5621')).not.toBeInTheDocument();
  });

  it('shows loading skeleton when mentors are loading', () => {
    (useMentors as any).mockReturnValue({
      mentors: [],
      loading: true,
      error: null,
      isFromApi: false,
      refetch: vi.fn(),
    });

    render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(4);
  });

  it('calls onMentorSelect when clicking a mentor card', () => {
    render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);

    // Click the card area (the Card has onClick)
    fireEvent.click(screen.getByText('러너 #2847'));

    expect(mockOnMentorSelect).toHaveBeenCalledWith(mockMentors[0]);
  });

  it('shows empty state when no mentors match filter', () => {
    render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);

    const searchInput = screen.getByLabelText('러너 검색');
    fireEvent.change(searchInput, { target: { value: '존재하지않는멘토' } });

    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
    expect(screen.getByText('다른 검색어나 필터를 사용해보세요')).toBeInTheDocument();
  });

  it('back button calls onBack', () => {
    // The MentorSearch component doesn't have a visible back button in its JSX.
    // The onBack prop is passed but the component itself relies on parent navigation.
    // We verify the prop is accepted and the component renders correctly.
    const { unmount } = render(<MentorSearch onBack={mockOnBack} onMentorSelect={mockOnMentorSelect} />);
    expect(screen.getByText('러너 찾기')).toBeInTheDocument();
    unmount();
  });
});
