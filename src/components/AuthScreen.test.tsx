import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthScreen } from './AuthScreen';

// Mock dependencies
vi.mock('./api', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  getProfile: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('lucide-react', () => {
  const icon = ({ children, ...props }: any) => <span {...props}>{children}</span>;
  return {
    Sparkles: icon,
    Mail: icon,
    Lock: icon,
    User: icon,
    ArrowRight: icon,
    Loader2: icon,
    Eye: icon,
    EyeOff: icon,
    Zap: icon,
    Shield: icon,
    Users: icon,
  };
});

vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: any) => {
        const { whileHover, whileTap, initial, animate, exit, transition, ...rest } = props;
        const Tag = prop === 'button' ? 'button' : prop === 'form' ? 'form' : 'div';
        return <Tag data-motion={prop as string} {...rest}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import * as api from './api';
import { toast } from 'sonner';

describe('AuthScreen', () => {
  const mockOnAuthSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);
    expect(screen.getByRole('form', { name: '로그인 양식' })).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  });

  it('can switch between login and signup tabs', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);
    // Default is login
    expect(screen.getByRole('form', { name: '로그인 양식' })).toBeInTheDocument();

    // Switch to signup
    fireEvent.click(screen.getByRole('tab', { name: '회원가입' }));
    expect(screen.getByRole('form', { name: '회원가입 양식' })).toBeInTheDocument();

    // Switch back to login
    fireEvent.click(screen.getByRole('tab', { name: '로그인' }));
    expect(screen.getByRole('form', { name: '로그인 양식' })).toBeInTheDocument();
  });

  it('shows name field only in signup mode', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);
    // Login mode: no name field
    expect(screen.queryByLabelText('이름')).not.toBeInTheDocument();

    // Switch to signup
    fireEvent.click(screen.getByRole('tab', { name: '회원가입' }));
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
  });

  it('shows password toggle button', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);
    expect(screen.getByLabelText('비밀번호 보기')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('비밀번호 보기'));
    expect(screen.getByLabelText('비밀번호 숨기기')).toBeInTheDocument();
  });

  it('disables submit when fields are empty', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);
    const form = screen.getByRole('form', { name: '로그인 양식' });
    fireEvent.submit(form);

    expect(toast.error).toHaveBeenCalledWith('이메일과 비밀번호를 입력해주세요.');
    expect(api.signIn).not.toHaveBeenCalled();
  });

  it('successful login calls api.signIn and api.getProfile, then onAuthSuccess', async () => {
    const mockSession = { access_token: 'test-token', user: { id: '1' } };
    const mockProfile = { profile: { role: 'mentee', name: '테스트' }, credits: 5 };
    (api.signIn as any).mockResolvedValue({ session: mockSession, accessToken: 'test-token' });
    (api.getProfile as any).mockResolvedValue(mockProfile);

    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } });

    const form = screen.getByRole('form', { name: '로그인 양식' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.signIn).toHaveBeenCalledWith('test@test.com', 'password123');
    });

    await waitFor(() => {
      expect(api.getProfile).toHaveBeenCalledWith('test-token');
    });

    expect(toast.success).toHaveBeenCalledWith('로그인 성공!');
    expect(mockOnAuthSuccess).toHaveBeenCalledWith(mockSession, mockProfile);
  });

  it('successful signup calls api.signUp and api.getProfile, then onAuthSuccess', async () => {
    const mockSession = { access_token: 'signup-token', user: { id: '2' } };
    const mockProfile = { profile: { role: 'mentee', name: '홍길동' }, credits: 5 };
    (api.signUp as any).mockResolvedValue({ session: mockSession, accessToken: 'signup-token' });
    (api.getProfile as any).mockResolvedValue(mockProfile);

    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    // Switch to signup
    fireEvent.click(screen.getByRole('tab', { name: '회원가입' }));

    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } });

    const form = screen.getByRole('form', { name: '회원가입 양식' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.signUp).toHaveBeenCalledWith('new@test.com', 'password123', '홍길동', 'mentee');
    });

    await waitFor(() => {
      expect(api.getProfile).toHaveBeenCalledWith('signup-token');
    });

    expect(toast.success).toHaveBeenCalledWith('가입 완료! 환영합니다.');
    expect(mockOnAuthSuccess).toHaveBeenCalledWith(mockSession, mockProfile);
  });

  it('shows error toast on login failure', async () => {
    (api.signIn as any).mockRejectedValue(new Error('로그인 실패'));

    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'wrong' } });

    const form = screen.getByRole('form', { name: '로그인 양식' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('로그인 실패');
    });

    expect(mockOnAuthSuccess).not.toHaveBeenCalled();
  });

  it('shows error toast on signup failure', async () => {
    (api.signUp as any).mockRejectedValue(new Error('회원가입 실패'));

    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.click(screen.getByRole('tab', { name: '회원가입' }));

    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } });

    const form = screen.getByRole('form', { name: '회원가입 양식' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('회원가입 실패');
    });

    expect(mockOnAuthSuccess).not.toHaveBeenCalled();
  });

  it('guest mode button calls onAuthSuccess with null session', () => {
    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.click(screen.getByText('로그인 없이 둘러보기'));

    expect(mockOnAuthSuccess).toHaveBeenCalledWith(null, {
      profile: { role: 'mentee', name: '게스트', onboardingCompleted: false },
      credits: 5,
    });
  });
});
