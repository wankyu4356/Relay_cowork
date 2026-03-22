import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewWrite } from './ReviewWrite';

vi.mock('./api', () => ({
  submitReview: vi.fn(),
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
    ArrowLeft: icon,
    Star: icon,
  };
});

vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: any) => {
        const { whileHover, whileTap, initial, animate, exit, transition, ...rest } = props;
        const Tag = prop === 'button' ? 'button' : prop === 'p' ? 'p' : 'div';
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

describe('ReviewWrite', () => {
  const mockOnBack = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('릴레이 후기 작성')).toBeInTheDocument();
  });

  it('displays mentor information', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('이서연 러너')).toBeInTheDocument();
    expect(screen.getByText('연세대 경영학과 4학년')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('renders star rating buttons', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('별점을 선택해주세요')).toBeInTheDocument();
    const starButtons = screen.getAllByRole('button').filter(
      btn => btn.getAttribute('data-motion') === 'button'
    );
    expect(starButtons.length).toBe(5);
  });

  it('renders predefined tags', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('#친절함')).toBeInTheDocument();
    expect(screen.getByText('#전문적')).toBeInTheDocument();
    expect(screen.getByText('#체계적')).toBeInTheDocument();
  });

  it('toggles tag selection on click', async () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    const tag = screen.getByText('#친절함');
    await userEvent.click(tag);
    await userEvent.click(tag);
  });

  it('submit button is disabled when no rating or short text', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    const submitBtn = screen.getByText('후기 등록하기');
    expect(submitBtn).toBeDisabled();
  });

  it('displays character count', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('0자')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/릴레이 세션에서 좋았던 점/);
    fireEvent.change(textarea, { target: { value: 'abc' } });

    expect(screen.getByText('3자')).toBeInTheDocument();
  });

  it('submits review successfully with valid data', async () => {
    (api.submitReview as any).mockResolvedValue({ success: true });

    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);

    // Click 5th star button
    const starButtons = screen.getAllByRole('button').filter(
      btn => btn.getAttribute('data-motion') === 'button'
    );
    fireEvent.click(starButtons[4]);

    // Type review text (30+ chars)
    const reviewText = 'This is a test review that is longer than thirty characters for testing.';
    const textarea = screen.getByPlaceholderText(/릴레이 세션에서 좋았던 점/);
    fireEvent.change(textarea, { target: { value: reviewText } });

    // Select a tag
    fireEvent.click(screen.getByText('#친절함'));

    // Click submit
    const submitBtn = screen.getByText('후기 등록하기');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.submitReview).toHaveBeenCalledWith({
        mentorId: 'mentor-1',
        rating: 5,
        content: reviewText,
        tags: ['친절함'],
      });
    });

    expect(toast.success).toHaveBeenCalledWith('릴레이 후기가 등록되었습니다! 🎉');
  });

  it('still shows success toast when API call fails', async () => {
    (api.submitReview as any).mockRejectedValue(new Error('Network error'));

    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);

    const starButtons = screen.getAllByRole('button').filter(
      btn => btn.getAttribute('data-motion') === 'button'
    );
    fireEvent.click(starButtons[4]);

    const textarea = screen.getByPlaceholderText(/릴레이 세션에서 좋았던 점/);
    fireEvent.change(textarea, { target: { value: 'This is a test review that is longer than thirty characters for testing.' } });

    fireEvent.click(screen.getByText('후기 등록하기'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('릴레이 후기가 등록되었습니다! 🎉');
    });
  });

  it('renders the "나중에 작성하기" button that calls onBack', async () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    await userEvent.click(screen.getByText('나중에 작성하기'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows review notice', () => {
    render(<ReviewWrite onBack={mockOnBack} onSubmit={mockOnSubmit} mentor={mockMentor} />);
    expect(screen.getByText('후기 공개 안내')).toBeInTheDocument();
  });
});
