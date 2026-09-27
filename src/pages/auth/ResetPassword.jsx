import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, Key, Mail, KeyRound } from 'lucide-react';
import api from '../../api';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState(searchParams.get('otp') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a 6-digit OTP code.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: password
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cc-mint-soft flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-cc-mint rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cc-lime/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-cc-forest">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-cc-muted">
          Enter your 6-digit OTP code and choose a new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-cc-forest/5 sm:rounded-3xl sm:px-10 border border-gray-100">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-cc-forest">Password Reset!</h3>
              <p className="text-sm text-cc-muted">Your password has been successfully reset. Redirecting to login...</p>
              <Link to="/login" className="block text-cc-forest font-semibold hover:text-cc-lime mt-4">
                Click here if you aren't redirected.
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">⚠️</div>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-cc-forest mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cc-lime focus:ring-1 focus:ring-cc-lime transition bg-gray-50/50 focus:bg-white"
                    placeholder="you@campus.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cc-forest mb-1.5">6-Digit OTP Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-10 pr-3 py-2.5 tracking-[0.3em] font-mono font-bold text-center border border-gray-200 rounded-xl text-lg outline-none focus:border-cc-lime focus:ring-1 focus:ring-cc-lime transition bg-gray-50/50 focus:bg-white"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cc-forest mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cc-lime focus:ring-1 focus:ring-cc-lime transition bg-gray-50/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cc-forest mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cc-lime focus:ring-1 focus:ring-cc-lime transition bg-gray-50/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full !rounded-xl !py-3 shadow-lg shadow-cc-lime/20" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cc-muted hover:text-cc-forest transition">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
