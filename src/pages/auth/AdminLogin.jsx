import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import api from '../../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setRole, showToast, setProfile } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/admin-login', { email, password });

      if (res.data.success) {
        const profileRes = await api.get('/api/users/profile');
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
          setRole(profileRes.data.data.role);
          showToast(res.data.message || 'Admin session started', 'success');
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cc-forest animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cc-mint text-cc-forest flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <Logo className="justify-center mb-2" />
          <h1 className="text-xl font-extrabold text-cc-forest">{t('auth.adminTitle')}</h1>
          <p className="text-sm text-cc-muted mt-1">{t('auth.adminSub')}</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('auth.email')}</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cc-lime outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">{t('auth.password')}</label>
            <div className="mt-1 relative">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-cc-muted hover:text-cc-forest transition"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full !rounded-xl !py-3">
            {loading ? t('auth.entering') : <><span className="mr-2">{t('auth.enterPanel')}</span> <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
        {/* <p className="text-[11px] text-center text-cc-muted mt-4 bg-cc-mint rounded-lg py-2">
          Demo: admin@campuscoin.app / admin123
        </p> */}
        <Link to="/login" className="block text-center text-sm text-cc-muted mt-4 hover:text-cc-forest">
          ← Student login
        </Link>
      </div>
    </div>
  );
}
