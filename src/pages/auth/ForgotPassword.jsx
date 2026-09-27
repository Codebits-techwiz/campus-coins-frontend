import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Lock, Eye, EyeOff, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useApp();
  
  const [step, setStep] = useState('email'); // 'email' | 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 1: Send OTP code to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
      if (res.data.success) {
        setStep('reset');
        showToast('Password reset OTP code has been sent to your email.', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP code
  const handleResendOtp = async () => {
    setError('');
    setResending(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
      if (res.data.success) {
        showToast('A fresh OTP code has been sent to your email.', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP code');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Reset password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      });

      if (res.data.success) {
        setSuccess(true);
        showToast('Password reset successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-cc-cream animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <Logo className="justify-center mb-6" />

        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h1 className="text-2xl font-extrabold text-cc-forest">Password Reset Successful!</h1>
            <p className="text-sm text-cc-muted">
              Your password has been updated. You can now login with your new password.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-cc-forest hover:text-cc-lime mt-4">
              <ArrowLeft className="w-4 h-4" /> {t('auth.backToLogin')}
            </Link>
          </div>
        ) : step === 'reset' ? (
          <>
            <h1 className="text-2xl font-extrabold text-cc-forest text-center">Reset Your Password</h1>
            <p className="text-sm text-cc-muted text-center mt-1 mb-6">
              Enter the 6-digit OTP code sent to <strong>{email}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">6-Digit OTP Code</label>
                <div className="mt-1 relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 text-center tracking-[0.3em] font-mono text-lg font-bold rounded-xl border border-gray-200 focus:border-cc-lime outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">New Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-cc-muted hover:text-cc-forest"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">Confirm New Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3 mt-2">
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  className="inline-flex items-center gap-1 text-cc-muted hover:text-cc-forest font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="inline-flex items-center gap-1 text-cc-forest hover:text-cc-lime font-semibold disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-cc-forest text-center">{t('auth.forgotTitle')}</h1>
            <p className="text-sm text-cc-muted text-center mt-1 mb-6">
              Enter your registered email address to receive a 6-digit password reset OTP code.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">{t('auth.email')}</label>
                <div className="mt-1.5 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@campus.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
                {loading ? 'Sending OTP Code...' : (
                  <>
                    <span className="mr-2">Send Reset OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-cc-muted hover:text-cc-forest">
              <ArrowLeft className="w-4 h-4" /> {t('auth.backToLogin')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
