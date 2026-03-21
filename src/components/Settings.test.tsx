import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Settings } from './Settings';

// Mock dependencies
vi.mock('./api', () => ({
  signOut: vi.fn(),
  updateProfile: vi.fn(),
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
    User: icon,
    Bell: icon,
    Lock: icon,
    CreditCard: icon,
    LogOut: icon,
    Shield: icon,
    Smartphone: icon,
    Mail: icon,
    Award: icon,
    Wallet: icon,
    HelpCircle: icon,
    FileText: icon,
    Camera: icon,
    Edit2: icon,
    Check: icon,
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
}));

import * as api from './api';
import { toast } from 'sonner';

describe('Settings', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('설정')).toBeInTheDocument();
  });

  it('displays profile information', () => {
    render(<Settings onBack={mockOnBack} credits={5} />);
    expect(screen.getByText('김민준')).toBeInTheDocument();
    expect(screen.getByText('연세대 경영학과 편입 준비 중입니다.')).toBeInTheDocument();
    expect(screen.getByText('minjun.kim@example.com')).toBeInTheDocument();
    expect(screen.getByText('5 크레딧')).toBeInTheDocument();
  });

  it('shows mentor badge when isMentorActive is true', () => {
    render(<Settings onBack={mockOnBack} isMentorActive={true} />);
    expect(screen.getByText('멘토')).toBeInTheDocument();
  });

  it('does not show mentor badge when isMentorActive is false', () => {
    render(<Settings onBack={mockOnBack} isMentorActive={false} />);
    expect(screen.queryByText('멘토')).not.toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    render(<Settings onBack={mockOnBack} />);
    const buttons = screen.getAllByRole('button');
    // The first button is the back button
    await userEvent.click(buttons[0]);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('expands profile edit section and shows form fields', async () => {
    render(<Settings onBack={mockOnBack} />);
    const profileSection = screen.getByText('프로필 수정');
    await userEvent.click(profileSection);

    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('소개')).toBeInTheDocument();
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('저장하기')).toBeInTheDocument();
  });

  it('saves profile and calls api.updateProfile', async () => {
    (api.updateProfile as any).mockResolvedValue({ success: true });

    render(<Settings onBack={mockOnBack} />);
    // Open profile edit section
    await userEvent.click(screen.getByText('프로필 수정'));

    // Click save
    await userEvent.click(screen.getByText('저장하기'));

    await waitFor(() => {
      expect(api.updateProfile).toHaveBeenCalledWith({
        name: '김민준',
        bio: '연세대 경영학과 편입 준비 중입니다.',
        email: 'minjun.kim@example.com',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('프로필이 서버에 저장되었습니다');
  });

  it('shows fallback toast when profile save fails', async () => {
    (api.updateProfile as any).mockRejectedValue(new Error('Network error'));

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('프로필 수정'));
    await userEvent.click(screen.getByText('저장하기'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('프로필이 저장되었습니다');
    });
  });

  it('saves notification settings', async () => {
    (api.updateProfile as any).mockResolvedValue({ success: true });

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('알림 설정 저장'));

    await waitFor(() => {
      expect(api.updateProfile).toHaveBeenCalledWith({
        notifications: {
          sessionReminder: true,
          messageNotif: true,
          aiNotif: true,
          marketingNotif: false,
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith('알림 설정이 서버에 저장되었습니다');
  });

  it('shows fallback toast when notification save fails', async () => {
    (api.updateProfile as any).mockRejectedValue(new Error('Fail'));

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('알림 설정 저장'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('알림 설정이 저장되었습니다');
    });
  });

  it('handles logout with confirmation', async () => {
    (api.signOut as any).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('로그아웃'));

    await waitFor(() => {
      expect(api.signOut).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('로그아웃 되었습니다');
  });

  it('does not logout when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('로그아웃'));

    expect(api.signOut).not.toHaveBeenCalled();
  });

  it('shows error toast when logout fails', async () => {
    (api.signOut as any).mockRejectedValue(new Error('Logout failed'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Settings onBack={mockOnBack} />);
    await userEvent.click(screen.getByText('로그아웃'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('로그아웃 중 오류가 발생했습니다');
    });
  });

  it('displays version info', () => {
    render(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Relay v1.0.0')).toBeInTheDocument();
  });
});
