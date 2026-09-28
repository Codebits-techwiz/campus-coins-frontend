import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../api';
import { ErrorBox } from '../../components/ErrorBox';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43'];

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        if (res.data.success) setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10 text-cc-muted">Loading stats...</div>;
  if (!stats) {
    return (
      <div className="max-w-lg mx-auto py-10 px-4">
        <ErrorBox message="We couldn’t load the stats right now. Please refresh the page." />
      </div>
    );
  }

  const pieData = stats.topCategories?.map(c => ({ name: c.name, value: c.count })) || [];
  const weeklyActive = stats.weeklyActiveUsers?.length
    ? stats.weeklyActiveUsers
    : [];

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">Usage Statistics</h1>
        <p className="text-sm text-cc-muted">Active users, transactions logged, most-used categories</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Active Users</p>
          <p className="text-3xl font-extrabold text-cc-forest mt-1">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Transactions Logged</p>
          <p className="text-3xl font-extrabold text-cc-lime mt-1">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <p className="text-xs font-bold text-cc-muted uppercase">Total Volume Logged</p>
          <p className="text-3xl font-extrabold text-cc-forest mt-1">
            ${(stats.totalVolume?.expense || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">Weekly Active Users</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActive}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#5CB85C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">Most-Used Categories</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
