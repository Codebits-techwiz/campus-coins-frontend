import { formatPkr } from '../../utils/currency';
import { Link } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Pin,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  X,
  Megaphone,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatMoney } from '../../utils/formatMoney';
import { Button } from '../../components/Button';
import { CategoryIcon } from '../../utils/categoryIcons';
import api from '../../api';
import { useState, useEffect } from 'react';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43'];


const getTxId = (t) => t._id || t.id;


const getCatName = (t) => {
  if (t.category && typeof t.category === 'object') return t.category.name;
  return t.category || '-';
};

export default function Dashboard() {
  const { profile, balance, monthIncome, monthExpense, transactions, announcements, dashboardSummary, showToast } = useApp();

  const income  = dashboardSummary?.currentMonth?.income  ?? dashboardSummary?.totals?.income ?? monthIncome;
  const expense = dashboardSummary?.currentMonth?.expenses ?? dashboardSummary?.totals?.expense ?? monthExpense;
  const bal     = dashboardSummary?.currentMonth?.balance  ?? dashboardSummary?.totals?.balance ?? balance;

  const recentTx = dashboardSummary?.recentTransactions ?? transactions.slice(0, 5);

  const [activities, setActivities] = useState([]);
  const [trend6Months, setTrend6Months] = useState([]);
  
  // Local state for tips to allow optimistic UI updates
  const [localTips, setLocalTips] = useState([]);

  useEffect(() => {
    if (dashboardSummary?.topTips) {
      setLocalTips(dashboardSummary.topTips);
    }
  }, [dashboardSummary?.topTips]);

  useEffect(() => {
    api.get('/api/activity/recent')
      .then(res => {
        if (res.data.success) {
          setActivities(res.data.data);
        }
      })
      .catch(console.error);

    const currentMonth = new Date().toISOString().slice(0, 7);
    api.get(`/api/reports/trend-6months?month=${currentMonth}`)
      .then(res => {
        if (res.data.success) {
          setTrend6Months((res.data.data || []).map(d => ({ month: d.month || d._id, income: d.income, expense: d.expense })));
        }
      })
      .catch(console.error);
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const expenseByCat = {};
  transactions
    .filter((t) => t.type === 'expense' && t.date?.startsWith(currentMonth))
    .forEach((t) => {
      const name = getCatName(t);
      expenseByCat[name] = (expenseByCat[name] || 0) + (t.amount || 0);
    });
  const pieData = Object.entries(expenseByCat).map(([name, value]) => ({ name, value }));
  const topCategory = dashboardSummary?.topCategory || [...pieData].sort((a, b) => b.value - a.value)[0];

  const budgets = dashboardSummary?.budgetVsActual || [];
  const alerts = budgets.filter((b) => b.limitAmount > 0 && (b.currentSpent || 0) / b.limitAmount >= 0.8);

  const greeting = dashboardSummary?.greeting || `Good day, ${profile?.name?.split(' ')[0] || 'Student'}`;

  const handleToggleTipPin = async (tipId) => {
    setLocalTips(localTips.map(t => (t._id || t.id) === tipId ? { ...t, isPinned: !t.isPinned, pinned: !t.pinned } : t));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/pin`);
    } catch (err) {
      showToast('Failed to pin tip', 'error');
      setLocalTips(localTips.map(t => (t._id || t.id) === tipId ? { ...t, isPinned: !t.isPinned, pinned: !t.pinned } : t));
    }
  };

  const handleDismissTip = async (tipId) => {
    const previous = [...localTips];
    setLocalTips(localTips.filter(t => (t._id || t.id) !== tipId));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/dismiss`);
    } catch (err) {
      showToast('Failed to dismiss tip', 'error');
      setLocalTips(previous);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cc-forest">
            {greeting}
          </h1>
          <p className="text-cc-muted text-sm mt-1">Here&apos;s your {new Date().toLocaleString('default', { month: 'long' })} money snapshot</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/transactions">
            <Button className="!rounded-xl">
              <Plus className="w-4 h-4" /> Quick Add
            </Button>
          </Link>
        </div>
      </div>


      {(announcements || [])
        .filter((a) => a.isActive !== false && a.active !== false)
        .slice(0, 3)
        .map((a) => (
          <div
            key={a._id || a.id}
            className="bg-gradient-to-r from-emerald-50 via-cc-mint/70 to-emerald-50 border border-cc-lime/40 rounded-2xl p-4 shadow-sm flex items-start gap-3.5 transition hover:shadow-md"
          >
            <div className="p-2.5 bg-cc-forest text-cc-lime rounded-xl shrink-0 shadow-sm mt-0.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-cc-forest text-sm">{a.title}</h3>
                <span className="text-[10px] bg-cc-forest text-white font-bold px-2.5 py-0.5 rounded-full shrink-0">
                  Campus Announcement
                </span>
              </div>
              <p className="text-xs text-cc-forest/80 mt-1 leading-relaxed">{a.message || a.body || a.desc}</p>
            </div>
          </div>
        ))}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase">Balance</span>
            <Wallet className="w-4 h-4 text-cc-lime" />
          </div>
          <p className="text-3xl font-extrabold text-cc-forest">{formatPkr(bal)}</p>
          <p className="text-xs text-cc-muted mt-1">Income − Expenses this month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase">Income</span>
            <TrendingUp className="w-4 h-4 text-cc-lime" />
          </div>
          <p className="text-3xl font-extrabold text-cc-lime">{formatPkr(income)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase">Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-cc-ink">{formatPkr(expense)}</p>
        </div>
      </div>


      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">Income vs Expense (6 months)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend6Months}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatPkr(value)} />
                <Bar dataKey="income" fill="#5CB85C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#0B3D2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-1">This Month&apos;s Top Category</h2>
          <p className="text-sm text-cc-muted mb-3">
            {topCategory ? `${topCategory.name} - ${formatPkr(topCategory.amount || topCategory.value || 0)}` : 'No expenses yet'}
          </p>
          <div className="h-44">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-cc-muted">
                Add expenses to see the chart
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-cc-forest flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cc-lime" /> Saving Tips
            </h2>
            <Link to="/app/insights" className="text-xs font-semibold text-cc-lime flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {localTips.length === 0 ? (
              <p className="text-sm text-cc-muted text-center py-4">No tips available yet.</p>
            ) : (
              localTips.map((tip) => {
                const isPinned = tip.isPinned || tip.pinned;
                const tipId = tip._id || tip.id;
                return (
                  <div key={tipId} className="flex gap-3 p-3 rounded-xl bg-cc-mint-soft border border-cc-mint items-start">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase text-cc-lime">{tip.impact} impact</span>
                      <p className="text-sm text-cc-ink mt-0.5">{tip.text}</p>
                      <p className="text-[10px] text-cc-muted italic mt-1 leading-tight">Notice: Advisory suggestion, not certified advice.</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleTipPin(tipId)}
                        className={`p-1.5 rounded-lg ${isPinned ? 'bg-cc-mint text-cc-lime' : 'text-cc-muted hover:bg-gray-50'}`}
                        title={isPinned ? 'Unpin' : 'Pin tip'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismissTip(tipId)}
                        className="p-1.5 rounded-lg text-cc-muted hover:bg-red-50 hover:text-red-500"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-cc-forest">Budget vs Actual</h2>
            <Link to="/app/budgets" className="text-xs font-semibold text-cc-lime">
              Manage
            </Link>
          </div>
          {alerts.length > 0 && (
            <div className="mb-3 flex items-start gap-2 text-amber-800 bg-amber-50 rounded-xl px-3 py-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {alerts.length} categor{alerts.length === 1 ? 'y' : 'ies'} near or over budget
            </div>
          )}
          <div className="space-y-3">
            {(budgets || []).length === 0 ? (
              <p className="text-sm text-cc-muted text-center py-4">No budgets set yet.</p>
            ) : (
              (budgets || []).map((b) => {
                const spent = b.currentSpent || 0;
                const limit = b.limitAmount || 1;
                const pct = Math.min(100, Math.round((spent / limit) * 100));
                const over = spent >= limit;
                return (
                  <div key={b._id || b.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-cc-ink flex items-center gap-1.5">
                        <CategoryIcon iconKey={b.category?.icon} color={b.category?.color} className="w-3 h-3" />
                        {b.category?.name}
                      </span>
                      <span className={over ? 'text-red-600 font-bold' : 'text-cc-muted'}>
                        {formatPkr(spent)} / {formatPkr(limit)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${over ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-cc-lime'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-bold text-cc-forest mb-4">Jump Back In (Recent Activity)</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-cc-muted text-center py-4">No recent activity found.</p>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div key={act.logId || act._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition">
                <div className="p-2 bg-cc-mint text-cc-forest rounded-full">
                  {act.transaction ? <ArrowRight className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cc-ink">
                    {act.action === 'create' ? 'Created' : 'Edited'} {act.transaction ? 'Transaction' : 'Category'}
                  </p>
                  <p className="text-xs text-cc-muted">
                    {act.transaction ? act.transaction.description : ''} - {new Date(act.at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-cc-forest">Recent Transactions</h2>
          <Link to="/app/transactions" className="text-xs font-semibold text-cc-lime">
            See all
          </Link>
        </div>
        {recentTx.length === 0 ? (
          <p className="text-sm text-cc-muted text-center py-4">No transactions yet. <Link to="/app/transactions" className="text-cc-lime font-semibold">Add your first one!</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-cc-muted border-b border-gray-100">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((t) => (
                  <tr key={getTxId(t)} className="border-b border-gray-50">
                    <td className="py-2.5 text-cc-muted whitespace-nowrap">
                      {t.date ? new Date(t.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2.5 font-medium text-cc-ink">{t.description}</td>
                    <td className="py-2.5">
                      <span className="text-xs bg-cc-mint text-cc-forest px-2 py-0.5 rounded-full font-medium">
                        {getCatName(t)}
                      </span>
                    </td>
                    <td className={`py-2.5 text-right font-bold ${t.type === 'income' ? 'text-cc-lime' : 'text-cc-ink'}`}>
                      {t.type === 'income' ? '+' : '−'}
                      {formatPkr(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
