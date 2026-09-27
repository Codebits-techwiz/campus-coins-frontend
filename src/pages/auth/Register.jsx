import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  Target,
  Wallet,
  Eye,
  EyeOff,
  Check,
  Circle,
  KeyRound,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';
import { PrivacyModal } from '../../components/PrivacyModal';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePositiveNumber,
  getPasswordChecks,
} from '../../utils/validation';

const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate'];

const PASSWORD_RULES = [
  { key: 'minLength', labelKey: 'auth.passwordRulesShort.minLength' },
  { key: 'upper', labelKey: 'auth.passwordRulesShort.upper' },
  { key: 'lower', labelKey: 'auth.passwordRulesShort.lower' },
  { key: 'number', labelKey: 'auth.passwordRulesShort.number' },
  { key: 'special', labelKey: 'auth.passwordRulesShort.special' },
];

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setRole, showToast, setProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicYear: 'Year 1',
    monthlyAllowance: '40000',
    savingsGoal: '10000',
    currency: 'PKR',
    agreePrivacy: false,
  });

  const passwordChecks = getPasswordChecks(form.password);

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    setFieldErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const errMsg = (code) => {
    if (!code) return '';
    const localized = t(`auth.errors.${code}`);
    return localized !== `auth.errors.${code}` ? localized : code;
  };

  const validateAll = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      monthlyAllowance: validatePositiveNumber(form.monthlyAllowance),
      savingsGoal: validatePositiveNumber(form.savingsGoal),
      agreePrivacy: form.agreePrivacy
        ? undefined
        : 'privacyRequired',
    };
    setFieldErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        academicYear: form.academicYear,
        monthlyAllowance: Number(form.monthlyAllowance),
        savingsGoal: Number(form.savingsGoal),
        currency: form.currency,
      };

      const res = await api.post('/api/auth/register', payload);

      if (res.data.success) {
        setStep('otp');
        showToast(res.data.message || 'OTP code sent to your email!', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp', {
        email: form.email.trim(),
        otp: otp.trim(),
      });

      if (res.data.success) {
        const profileRes = await api.get('/api/users/profile');
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
          setRole(profileRes.data.data.role);
          showToast('Email verified & Account created! Welcome to Campus Coin.', 'success');
          navigate('/app');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResending(true);
    try {
      const res = await api.post('/api/auth/resend-otp', { email: form.email.trim() });
      if (res.data.success) {
        showToast('A new OTP verification code has been sent to your email.', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const fieldClass = (key, withToggle = false) =>
    `w-full pl-10 ${withToggle ? 'pr-11' : 'pr-4'} py-3 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-cc-lime/20 ${
      fieldErrors[key]
        ? 'border-red-400 focus:border-red-400'
        : 'border-gray-200 focus:border-cc-lime'
    }`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cc-mint-soft to-cc-cream animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-4" />
          <h1 className="text-2xl font-extrabold text-cc-forest">
            {step === 'otp' ? 'Verify Email Address' : t('auth.registerTitle')}
          </h1>
          <p className="text-sm text-cc-muted mt-1">
            {step === 'otp'
              ? `We sent a 6-digit OTP code to ${form.email}`
              : t('auth.registerSub')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                Enter 6-Digit OTP Code
              </label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cc-muted" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 text-center tracking-[0.4em] font-mono text-xl font-bold rounded-xl border border-gray-200 focus:border-cc-lime focus:ring-2 focus:ring-cc-lime/20 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <Button type="submit" disabled={otpLoading} className="w-full !rounded-xl !py-3">
              {otpLoading ? (
                'Verifying Code...'
              ) : (
                <>
                  <span className="mr-2">Verify & Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError('');
                }}
                className="inline-flex items-center gap-1 text-cc-muted hover:text-cc-forest font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="inline-flex items-center gap-1 text-cc-forest hover:text-cc-lime font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                {t('auth.name')}
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ayesha Khan"
                  autoComplete="name"
                  className={fieldClass('name')}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.name)}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                {t('auth.email')}
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@campus.edu"
                  autoComplete="email"
                  className={fieldClass('email')}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.email)}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={fieldClass('password', true)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-cc-muted hover:text-cc-forest transition"
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                {PASSWORD_RULES.map(({ key, labelKey }) => {
                  const ok = passwordChecks[key];
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 border ${
                        ok
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                          : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}
                    >
                      {ok ? (
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      )}
                      <span>{t(labelKey)}</span>
                    </span>
                  );
                })}
              </div>

              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.password)}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                {t('auth.confirmPassword')}
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={fieldClass('confirmPassword', true)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-cc-muted hover:text-cc-forest transition"
                  aria-label={showConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="mt-1 text-xs text-cc-lime font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t('auth.passwordMatch')}
                </p>
              )}
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.confirmPassword)}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                {t('auth.academicYear')}
              </label>
              <div className="mt-1 relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                <select
                  value={form.academicYear}
                  onChange={set('academicYear')}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm appearance-none bg-white"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                  {t('auth.monthlyAllowance')}
                </label>
                <div className="mt-1 relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type="number"
                    min="0"
                    value={form.monthlyAllowance}
                    onChange={set('monthlyAllowance')}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-cc-lime/20 ${
                      fieldErrors.monthlyAllowance
                        ? 'border-red-400'
                        : 'border-gray-200 focus:border-cc-lime'
                    }`}
                  />
                </div>
                {fieldErrors.monthlyAllowance && (
                  <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.monthlyAllowance)}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase tracking-wide">
                  {t('auth.savingsGoal')}
                </label>
                <div className="mt-1 relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
                  <input
                    type="number"
                    min="0"
                    value={form.savingsGoal}
                    onChange={set('savingsGoal')}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-cc-lime/20 ${
                      fieldErrors.savingsGoal
                        ? 'border-red-400'
                        : 'border-gray-200 focus:border-cc-lime'
                    }`}
                  />
                </div>
                {fieldErrors.savingsGoal && (
                  <p className="mt-1 text-xs text-red-500">{errMsg(fieldErrors.savingsGoal)}</p>
                )}
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-cc-muted select-none">
                <input
                  type="checkbox"
                  checked={form.agreePrivacy}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((f) => ({ ...f, agreePrivacy: checked }));
                    if (checked) {
                      setFieldErrors((prev) => ({ ...prev, agreePrivacy: undefined }));
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-cc-forest focus:ring-cc-lime shrink-0 cursor-pointer"
                />
                <span>
                  {t('auth.agreeTerms') || 'I have read and agree to the'}{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="font-semibold text-cc-forest underline hover:text-cc-lime transition"
                  >
                    {t('auth.privacyPolicy') || 'Privacy Policy & Terms of Service'}
                  </button>
                </span>
              </label>
              {fieldErrors.agreePrivacy && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errMsg(fieldErrors.agreePrivacy) || 'You must accept the Privacy Policy to continue.'}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3 mt-2">
              {loading ? (
                'Sending OTP...'
              ) : (
                <>
                  <span className="mr-2">{t('common.getStartedFree')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-cc-muted mt-6">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-cc-forest hover:text-cc-lime">
            {t('nav.login')}
          </Link>
        </p>
      </div>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setForm((f) => ({ ...f, agreePrivacy: true }));
          setFieldErrors((prev) => ({ ...prev, agreePrivacy: undefined }));
        }}
      />
    </div>
  );
}
