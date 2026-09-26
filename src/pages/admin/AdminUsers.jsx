import { useState, useEffect } from 'react';
import { Ban, CheckCircle, KeyRound, Loader2 } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';

export default function AdminUsers() {
  const { showToast } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const res = await api.patch(`/api/admin/users/${id}/status`, { isActive: !currentStatus });
      if (res.data.success) {
        showToast(`User ${!currentStatus ? 'enabled' : 'disabled'} successfully`, 'success');
        setUsers(users.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const resetUserPassword = async (id) => {
    if (!window.confirm('Are you sure you want to reset this user\'s password?')) return;
    try {
      const res = await api.post(`/api/admin/users/${id}/reset-password`);
      if (res.data.success) {
        showToast(`Password reset! Temp: ${res.data.data.temporaryPassword}`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reset password', 'error');
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cc-lime" /></div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">User Accounts</h1>
        <p className="text-sm text-cc-muted">View, disable, or reset student accounts</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cc-mint-soft">
              <tr className="text-left text-xs text-cc-muted">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Txns</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-cc-forest">{u.name}</p>
                    <p className="text-xs text-cc-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-cc-muted">{u.academicYear || '—'}</td>
                  <td className="px-4 py-3 font-medium">{u.transactions || 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.isActive ? 'bg-cc-mint text-cc-lime-dark' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u._id, u.isActive)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-cc-lime"
                      title={u.isActive ? 'Disable' : 'Enable'}
                    >
                      {u.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetUserPassword(u._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-cc-lime"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
