import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, KeyRound, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { getFriendlyError } from '../../utils/friendlyError';
import api from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setRole, setProfile, showToast } = useApp();
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [pendingToken, setPendingToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const finishLogin = async (message) => {
    const profileRes = await api.get('/api/users/profile');
    if (profileRes.data.success) {
      setProfile(profileRes.data.data);
      setRole(profileRes.data.data.role);
      showToast(message || t('auth.loginSuccess'), 'success');
      navigate('/app');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.data?.requires2FA) {
          setPendingToken(res.data.data.pendingToken || '');
          setEmail(res.data.data.email || email);
          setOtp('');
          setStep('otp');
          showToast(t('auth.otpSent'), 'success');
        } else {
          await finishLogin(res.data.message);
        }
      }
    } catch (err) {
      showToast(getFriendlyError(err, t('auth.loginFailed')), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      showToast(t('auth.otpInvalid'), 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-login-otp', {
        email: email.trim(),
        otp: otp.trim(),
        pendingToken
      });
      if (res.data.success) {
        await finishLogin(res.data.message);
      }
    } catch (err) {
      showToast(getFriendlyError(err, t('auth.otpFailed')), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await api.post('/api/auth/resend-login-otp', {
        email: email.trim(),
        pendingToken
      });
      if (res.data.success) {
        if (res.data.data?.pendingToken) setPendingToken(res.data.data.pendingToken);
        showToast(t('auth.otpResent'), 'success');
      }
    } catch (err) {
      showToast(getFriendlyError(err, t('auth.otpResendFailed')), 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-cc-cream animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl font-extrabold text-cc-forest">
            {step === 'otp' ? t('auth.otpTitle') : t('auth.loginTitle')}
          </h1>
          <p className="text-sm text-cc-muted mt-1">
            {step === 'otp' ? t('auth.otpSub', { email }) : t('auth.loginSub')}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">{t('auth.password')}</label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cc-muted hover:text-cc-forest"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-cc-lime hover:underline">
                {t('auth.forgot')}
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
              {loading ? t('auth.signingIn') : t('auth.signIn')} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">{t('auth.otpCode')}</label>
              <div className="mt-1.5 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm tracking-[0.3em] font-semibold"
                  placeholder="••••••"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
              {loading ? t('auth.verifying') : t('auth.verifyOtp')} <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              type="button"
              disabled={resending}
              onClick={handleResendOtp}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-cc-forest hover:text-cc-lime"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? t('auth.resending') : t('auth.resendOtp')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('credentials');
                setOtp('');
              }}
              className="w-full text-xs text-cc-muted hover:text-cc-forest"
            >
              {t('auth.backToLogin')}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-cc-muted mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-cc-lime hover:underline">
            {t('nav.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
