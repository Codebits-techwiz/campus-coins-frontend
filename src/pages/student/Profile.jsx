import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, Save, Moon, Sun, Type, KeyRound, Lock, Camera, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import api from '../../api';
import { getAvatarUrl } from '../../utils/avatarUrl';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile, showToast, darkMode, setDarkMode, fontSize, setFontSize } = useApp();
  const [form, setForm] = useState({ 
    ...profile,
    monthlyAllowanceBaseline: profile?.monthlyAllowanceBaseline || 0,
    monthlySavingsGoal: profile?.monthlySavingsGoal || 0,
    currency: profile?.currency || 'PKR'
  });

  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      ...profile,
      monthlyAllowanceBaseline: profile.monthlyAllowanceBaseline ?? prev.monthlyAllowanceBaseline ?? 0,
      monthlySavingsGoal: profile.monthlySavingsGoal ?? prev.monthlySavingsGoal ?? 0,
      currency: profile.currency || prev.currency || 'PKR',
    }));
  }, [profile]);
  const avatarRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPass, setChangingPass] = useState(false);

  const avatarUrl = getAvatarUrl(profile?.avatar);
  const initials = profile?.name
    ? profile.name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(t('app.profile.avatarInvalid'), 'error');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast(t('app.profile.avatarTooLarge'), 'error');
      e.target.value = '';
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/api/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProfile(res.data.data);
        showToast(t('app.profile.avatarUpdated'), 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || t('app.profile.avatarFailed'), 'error');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        academicYear: form.academicYear,
        monthlyAllowanceBaseline: Number(form.monthlyAllowanceBaseline),
        monthlySavingsGoal: Number(form.monthlySavingsGoal),
        currency: form.currency
      };
      const res = await api.put('/api/users/profile', payload);
      if (res.data.success) {
        setProfile(res.data.data);
        showToast(t('app.profile.savedSuccess'), 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || t('app.profile.updateFailed'), 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      showToast(t('app.profile.currentRequired'), 'error');
      return;
    }
    if (passwords.newPassword.length < 8) {
      showToast(t('app.profile.minLength'), 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast(t('app.profile.mismatch'), 'error');
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put('/api/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      if (res.data.success) {
        showToast(t('app.profile.passwordChanged'), 'success');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || t('app.profile.passwordFailed');
      showToast(errorMsg, 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleToggle2FA = async () => {
    const next = !profile?.twoFactorEnabled;
    setToggling2FA(true);
    try {
      const res = await api.put('/api/users/two-factor', { enabled: next });
      if (res.data.success) {
        setProfile(res.data.data);
        showToast(
          next ? t('app.profile.twoFactorEnabled') : t('app.profile.twoFactorDisabled'),
          'success'
        );
      }
    } catch (err) {
      showToast(err.response?.data?.error || t('app.profile.twoFactorFailed'), 'error');
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">{t('app.profile.title')}</h1>
        <p className="text-sm text-cc-muted">{t('app.profile.subtitle')}</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full ring-4 ring-cc-mint object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full ring-4 ring-cc-mint bg-cc-lime flex items-center justify-center text-white font-bold text-xl">
                {initials}
              </div>
            )}
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cc-forest text-white flex items-center justify-center shadow-md hover:bg-cc-lime transition disabled:opacity-50"
              title={t('app.profile.uploadPhoto')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-bold text-cc-forest">{profile.name}</p>
            <p className="text-xs text-cc-muted">{profile.email}</p>
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => avatarRef.current?.click()}
              className="mt-1.5 text-xs font-semibold text-cc-lime hover:underline disabled:opacity-50"
            >
              {uploadingAvatar ? t('app.profile.uploadingPhoto') : t('app.profile.uploadPhoto')}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.fullName')}</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.academicYear')}</label>
          <select
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          >
            {[
              { value: 'Year 1', label: t('app.profile.year1') },
              { value: 'Year 2', label: t('app.profile.year2') },
              { value: 'Year 3', label: t('app.profile.year3') },
              { value: 'Year 4', label: t('app.profile.year4') },
              { value: 'Graduate', label: t('app.profile.graduate') },
            ].map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.monthlyAllowance', { currency: form.currency })}</label>
            <input
              type="number"
              value={form.monthlyAllowanceBaseline}
              onChange={(e) => setForm({ ...form, monthlyAllowanceBaseline: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.savingsGoal', { currency: form.currency })}</label>
            <input
              type="number"
              value={form.monthlySavingsGoal}
              onChange={(e) => setForm({ ...form, monthlySavingsGoal: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.currency')}</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          >
            <option value="PKR">{t('app.profile.currencyPkr')}</option>
            <option value="USD">{t('app.profile.currencyUsd')}</option>
            <option value="EUR">{t('app.profile.currencyEur')}</option>
            <option value="GBP">{t('app.profile.currencyGbp')}</option>
          </select>
        </div>
        <Button type="submit" className="!rounded-xl">
          <Save className="w-4 h-4" /> {t('app.profile.saveProfile')}
        </Button>
      </form>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-cc-forest flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cc-lime" /> {t('app.profile.twoFactorTitle')}
            </h2>
            <p className="text-sm text-cc-muted mt-1">{t('app.profile.twoFactorHint')}</p>
          </div>
          <button
            type="button"
            disabled={toggling2FA}
            onClick={handleToggle2FA}
            className={`relative shrink-0 w-12 h-7 rounded-full transition ${
              profile?.twoFactorEnabled ? 'bg-cc-lime' : 'bg-gray-300'
            } disabled:opacity-50`}
            aria-pressed={!!profile?.twoFactorEnabled}
            aria-label={t('app.profile.twoFactorTitle')}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
                profile?.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs font-semibold text-cc-forest">
          {profile?.twoFactorEnabled ? t('app.profile.twoFactorOn') : t('app.profile.twoFactorOff')}
        </p>
      </div>

      {/* Change Password Card */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-cc-forest flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-cc-lime" /> {t('app.profile.securityTitle')}
        </h2>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.currentPassword')}</label>
          <input
            type="password"
            required
            placeholder={t('app.profile.currentPasswordPh')}
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.newPassword')}</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder={t('app.profile.newPasswordPh')}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.profile.confirmPassword')}</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder={t('app.profile.confirmPasswordPh')}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
            />
          </div>
        </div>
        <Button type="submit" disabled={changingPass} className="!rounded-xl">
          <Lock className="w-4 h-4" /> {changingPass ? t('app.profile.updating') : t('app.profile.updatePassword')}
        </Button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-cc-forest mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cc-lime" /> {t('app.profile.importCsvTitle')}
        </h2>
        <p className="text-sm text-cc-muted mb-4">
          {t('app.profile.importCsvHint')}
        </p>
        <Button
          variant="outline"
          className="!rounded-xl"
          onClick={() => navigate('/app/transactions?import=csv')}
        >
          {t('app.profile.chooseCsv')}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-cc-forest">{t('app.profile.accessibility')}</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:border-cc-lime"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? t('nav.themeLight') : t('nav.themeDark')}
          </button>
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
            <Type className="w-4 h-4 text-cc-muted ml-2" />
            {['sm', 'md', 'lg'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                  fontSize === s ? 'bg-cc-forest text-white' : 'text-cc-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
