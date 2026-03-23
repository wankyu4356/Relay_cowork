import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutcomeReport } from './OutcomeReport';

vi.mock('./api', () => ({
  createOutcome: vi.fn(),
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
    PartyPopper: icon,
    Frown: icon,
    ArrowLeft: icon,
    Loader2: icon,
  };
});

vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: any) => {
        const { whileHover, whileTap, initial, animate, exit, transition, ...rest } = props;
        const Tag = prop === 'button' ? 'button' : 'div';
        return <Tag data-motion={prop as string} {...rest}>{children}</Tag>;
      };
    },
  }),
}));

import * as api from './api';
import { toast } from 'sonner';

const mockMentor = {
  id: 'mentor-1',
  name: '이서연',
  university: '연세대',
  major: '경영학과',
  year: '4학년',
  rating: 4.8,
  reviews: 23,
  sessions: 45,
  successRate: 92,
  responseTime: '30분',
  price: 50000,
  badge: 'gold' as const,
  verified: true,
  avatar: '👩‍🏫',
};

describe('OutcomeReport', () => {
  const mockOnBack = vi.fn();
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    onBack: mockOnBack,
    onSubmit: mockOnSubmit,
    mentor: mockMentor,
    purpose: '연세대 경영 편입',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<OutcomeReport {...defaultProps} />);
    expect(screen.getByText('릴레이 성과 보고')).toBeInTheDocument();
  });

  it('displays mentor information and purpose', () => {
    render(<OutcomeReport {...defaultProps} />);
    expect(screen.getByText('이서연 러너')).toBeInTheDocument();
    expect(screen.getByText('연세대 경영학과')).toBeInTheDocument();
    expect(screen.getByText('목표: 연세대 경영 편입')).toBeInTheDocument();
  });

  it('displays success and fail outcome options', () => {
    render(<OutcomeReport {...defaultProps} />);
    expect(screen.getByText('합격했어요!')).toBeInTheDocument();
    expect(screen.getByText('아쉽게 탈락')).toBeInTheDocument();
    expect(screen.getByText('+10,000원 크레딧')).toBeInTheDocument();
    expect(screen.getByText('+15,000원 크레딧')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    render(<OutcomeReport {...defaultProps} />);
    const backButton = screen.getAllByRole('button')[0];
    await userEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows detail textarea after selecting success outcome', async () => {
    render(<OutcomeReport {...defaultProps} />);
    await userEvent.click(screen.getByText('합격했어요!'));
    expect(screen.getByText('합격 소감')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/릴레이 세션이 어떻게 도움이 되었나요/)).toBeInTheDocument();
  });

  it('shows detail textarea after selecting fail outcome', async () => {
    render(<OutcomeReport {...defaultProps} />);
    await userEvent.click(screen.getByText('아쉽게 탈락'));
    expect(screen.getByText('아쉬운 점')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/다음 시도 때 개선할 점/)).toBeInTheDocument();
  });

  it('submit button is disabled initially', () => {
    render(<OutcomeReport {...defaultProps} />);
    expect(screen.getByText('보고 완료')).toBeDisabled();
  });

  it('submit button is disabled when detail is too short', async () => {
    render(<OutcomeReport {...defaultProps} />);
    await userEvent.click(screen.getByText('합격했어요!'));

    const textarea = screen.getByPlaceholderText(/릴레이 세션이 어떻게 도움이 되었나요/);
    fireEvent.change(textarea, { target: { value: '짧은' } });

    expect(screen.getByText('보고 완료')).toBeDisabled();
  });

  it('submits success outcome with valid data', async () => {
    (api.createOutcome as any).mockResolvedValue({ success: true });

    render(<OutcomeReport {...defaultProps} />);

    await userEvent.click(screen.getByText('합격했어요!'));

    const textarea = screen.getByPlaceholderText(/릴레이 세션이 어떻게 도움이 되었나요/);
    const detailText = 'Thanks to the mentor I passed the exam successfully!';
    fireEvent.change(textarea, { target: { value: detailText } });

    await userEvent.click(screen.getByText('보고 완료'));

    await waitFor(() => {
      expect(api.createOutcome).toHaveBeenCalledWith({
        mentorId: 'mentor-1',
        result: 'success',
        detail: detailText,
        purpose: '연세대 경영 편입',
      });
    });

    expect(mockOnSubmit).toHaveBeenCalledWith('success', detailText);
    expect(toast.success).toHaveBeenCalledWith('축하합니다! 🎉 합격 크레딧 10,000원이 지급되었습니다');
  });

  it('submits fail outcome with valid data', async () => {
    (api.createOutcome as any).mockResolvedValue({ success: true });

    render(<OutcomeReport {...defaultProps} />);

    await userEvent.click(screen.getByText('아쉽게 탈락'));

    const textarea = screen.getByPlaceholderText(/다음 시도 때 개선할 점/);
    const detailText = 'I will prepare harder next time. Interview prep was insufficient.';
    fireEvent.change(textarea, { target: { value: detailText } });

    await userEvent.click(screen.getByText('보고 완료'));

    await waitFor(() => {
      expect(api.createOutcome).toHaveBeenCalledWith({
        mentorId: 'mentor-1',
        result: 'fail',
        detail: detailText,
        purpose: '연세대 경영 편입',
      });
    });

    expect(mockOnSubmit).toHaveBeenCalledWith('fail', detailText);
    expect(toast.success).toHaveBeenCalledWith('재도전 크레딧 15,000원이 지급되었습니다. 다시 도전하세요!');
  });

  it('falls back gracefully when API fails', async () => {
    (api.createOutcome as any).mockRejectedValue(new Error('Network error'));

    render(<OutcomeReport {...defaultProps} />);

    await userEvent.click(screen.getByText('합격했어요!'));

    const textarea = screen.getByPlaceholderText(/릴레이 세션이 어떻게 도움이 되었나요/);
    const detailText = 'Thanks to the mentor I passed the exam successfully!';
    fireEvent.change(textarea, { target: { value: detailText } });

    await userEvent.click(screen.getByText('보고 완료'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('success', detailText);
    });

    expect(toast.success).toHaveBeenCalledWith('축하합니다! 🎉 합격 크레딧 10,000원이 지급되었습니다');
  });

  it('calls onBack via "나중에 하기" button', async () => {
    render(<OutcomeReport {...defaultProps} />);
    await userEvent.click(screen.getByText('나중에 하기'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('displays benefits section', () => {
    render(<OutcomeReport {...defaultProps} />);
    expect(screen.getByText(/릴레이 성과 보고 시 혜택/)).toBeInTheDocument();
  });

  it('shows character count after selecting outcome', async () => {
    render(<OutcomeReport {...defaultProps} />);
    await userEvent.click(screen.getByText('합격했어요!'));

    await waitFor(() => {
      expect(screen.getByText('0자')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/릴레이 세션이 어떻게 도움이 되었나요/);
    fireEvent.change(textarea, { target: { value: 'a' } });

    expect(screen.getByText('1자')).toBeInTheDocument();
  });
});
