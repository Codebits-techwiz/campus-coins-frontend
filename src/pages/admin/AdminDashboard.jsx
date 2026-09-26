import { Users, ArrowLeftRight, Tags, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { users, transactions, categories, announcements } = useApp();
  const activeUsers = users.filter((u) => u.status === 'active').length;

  const cards = [
    { label: 'Active Users', value: activeUsers, icon: Users, to: '/admin/users', color: 'bg-cc-mint text-cc-lime' },
    { label: 'Total Transactions', value: transactions.length + 180, icon: ArrowLeftRight, to: '/admin/stats', color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', value: categories.filter((c) => c.isDefault).length, icon: Tags, to: '/admin/categories', color: 'bg-amber-50 text-amber-600' },
    { label: 'Active Announcements', value: announcements.filter((a) => a.active).length, icon: Activity, to: '/admin/announcements', color: 'bg-purple-50 text-purple-600' },
  ];

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
                <tr key={u.id} className="border-b border-gray-50">
                  <td className="py-2.5 font-medium">{u.name}</td>
                  <td className="py-2.5 text-cc-muted">{u.email}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.status === 'active' ? 'bg-cc-mint text-cc-lime-dark' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-cc-muted">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
