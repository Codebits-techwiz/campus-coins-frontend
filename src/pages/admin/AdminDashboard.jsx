import { useEffect, useState } from 'react';
import { Users, ArrowLeftRight, Tags, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/users'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (usersRes.data.success) setUsers(usersRes.data.data || []);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: 'Active Users', value: stats?.activeUsers ?? '—', icon: Users, to: '/admin/users', color: 'bg-cc-mint text-cc-lime' },
    { label: 'Total Transactions', value: stats?.totalTransactions ?? '—', icon: ArrowLeftRight, to: '/admin/stats', color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', value: stats?.defaultCategories ?? '—', icon: Tags, to: '/admin/categories', color: 'bg-amber-50 text-amber-600' },
    { label: 'Active Announcements', value: stats?.activeAnnouncements ?? '—', icon: Activity, to: '/admin/announcements', color: 'bg-purple-50 text-purple-600' },
  ];

  if (loading) {
    return <div className="text-center py-10 text-cc-muted">Loading dashboard...</div>;
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">Admin Dashboard</h1>
        <p className="text-sm text-cc-muted">Platform oversight for users, categories, announcements, and usage</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, index) => (
          <Link
            key={index}
            to={c.to}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-cc-forest">{c.value}</p>
            <p className="text-xs text-cc-muted font-medium mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-bold text-cc-forest mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-cc-muted border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 4).map((u) => (
                <tr key={u._id || u.id} className="border-b border-gray-50">
                  <td className="py-2.5 font-medium">{u.name}</td>
                  <td className="py-2.5 text-cc-muted">{u.email}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.isActive !== false ? 'bg-cc-mint text-cc-lime-dark' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {u.isActive !== false ? 'active' : 'disabled'}
                    </span>
                  </td>
                  <td className="py-2.5 text-cc-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-cc-muted">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
