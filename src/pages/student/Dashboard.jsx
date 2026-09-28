import { useTranslation } from 'react-i18next';
import { translateDynamicText } from '../../utils/translateDynamicText';
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
  Bookmark,
  Banknote,
  PiggyBank,
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
import { getTipImpact } from '../../utils/tipImpact';
import api from '../../api';
import { useState, useEffect } from 'react';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43'];


const getTxId = (t) => t._id || t.id;


const getCatName = (t) => {
  if (t.category && typeof t.category === 'object') return t.category.name;
  return t.category || '-';
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { profile, balance, monthIncome, monthExpense, transactions, dashboardSummary, showToast } = useApp();

  // Live monthly totals from transactions — always up to date after add/edit/delete
  const income = monthIncome;
  const expense = monthExpense;
  const bal = balance;
  const allowance =
    profile?.monthlyAllowanceBaseline ??
    dashboardSummary?.user?.monthlyAllowanceBaseline ??
    0;
  const savingsGoal =
    profile?.monthlySavingsGoal ??
    dashboardSummary?.user?.monthlySavingsGoal ??
    0;

  const recentTx = transactions.slice(0, 5);

  const [activities, setActivities] = useState([]);
  const [trend6Months, setTrend6Months] = useState([]);
  
  // Local state for tips to allow optimistic UI updates
  const [localTips, setLocalTips] = useState([]);
  const [bookmarkedTipIds, setBookmarkedTipIds] = useState(new Set());

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

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    api.get(`/api/reports/trend-6months?month=${currentMonth}`)
      .then(res => {
        if (res.data.success) {
          setTrend6Months((res.data.data || []).map(d => ({ month: d.month || d._id, income: d.income, expense: d.expense })));
        }
      })
      .catch(console.error);

    api.get('/api/bookmarks')
      .then((res) => {
        if (res.data.success) {
          const tipIds = new Set(
            (res.data.data || [])
              .filter((b) => b.refType === 'tip')
              .map((b) => b.refId)
          );
          setBookmarkedTipIds(tipIds);
        }
      })
      .catch(console.error);
  }, [transactions.length]);

  const nowLocal = new Date();
  const currentMonth = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}`;
  const expenseByCat = {};
  transactions
    .filter((t) => {
      if (t.type !== 'expense' || !t.date) return false;
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === currentMonth;
    })
    .forEach((t) => {
      const name = getCatName(t);
      expenseByCat[name] = (expenseByCat[name] || 0) + (t.amount || 0);
    });
  const pieData = Object.entries(expenseByCat).map(([name, value]) => ({ name, value }));
  const topCategory = dashboardSummary?.topCategory || [...pieData].sort((a, b) => b.value - a.value)[0];

  const budgets = dashboardSummary?.budgetVsActual || [];
  const alerts = budgets.filter((b) => b.limitAmount > 0 && (b.currentSpent || 0) / b.limitAmount >= 0.8);

  const greeting = dashboardSummary?.greeting || t('app.dashboard.greeting', { name: profile?.name?.split(' ')[0] || t('studentNav.student') });

  const handleToggleTipPin = async (tipId) => {
    setLocalTips(localTips.map(t => (t._id || t.id) === tipId ? { ...t, isPinned: !t.isPinned, pinned: !t.pinned } : t));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/pin`);
    } catch (err) {
      showToast(t('app.dashboard.pinFailed'), 'error');
      setLocalTips(localTips.map(t => (t._id || t.id) === tipId ? { ...t, isPinned: !t.isPinned, pinned: !t.pinned } : t));
    }
  };

  const handleDismissTip = async (tipId) => {
    const previous = [...localTips];
    setLocalTips(localTips.filter(t => (t._id || t.id) !== tipId));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/dismiss`);
    } catch (err) {
      showToast(t('app.dashboard.dismissFailed'), 'error');
      setLocalTips(previous);
    }
  };

  const handleBookmarkTip = async (tipId) => {
    if (bookmarkedTipIds.has(tipId)) {
      showToast(t('app.insights.tipBookmarkExists'), 'info');
      return;
    }
    try {
      const res = await api.post('/api/bookmarks', {
        refType: 'tip',
        refId: tipId,
        note: t('app.insights.tipBookmarkNote'),
      });
      if (res.data.success) {
        setBookmarkedTipIds((prev) => new Set([...prev, tipId]));
        showToast(t('app.insights.tipBookmarkSuccess'), 'success');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setBookmarkedTipIds((prev) => new Set([...prev, tipId]));
        showToast(t('app.insights.tipBookmarkExists'), 'info');
      } else {
        showToast(t('app.insights.tipBookmarkFailed'), 'error');
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cc-forest">
            {greeting}
          </h1>
          <p className="text-cc-muted text-sm mt-1">{t('app.dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/transactions">
            <Button className="!rounded-xl">
              <Plus className="w-4 h-4" /> {t('app.dashboard.quickAdd')}
            </Button>
          </Link>
        </div>
      </div>




      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase truncate">{t('app.dashboard.balance')}</span>
            <Wallet className="w-4 h-4 text-cc-lime shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cc-forest tabular-nums break-words leading-tight">
            {formatMoney(bal, profile?.currency)}
          </p>
          <p className="text-xs text-cc-muted mt-1">{t('app.dashboard.balanceFormula')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase truncate">{t('app.dashboard.income')}</span>
            <TrendingUp className="w-4 h-4 text-cc-lime shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cc-lime tabular-nums break-words leading-tight">
            {formatMoney(income, profile?.currency)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase truncate">{t('app.dashboard.expenses')}</span>
            <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cc-ink tabular-nums break-words leading-tight">
            {formatMoney(expense, profile?.currency)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase truncate">{t('app.dashboard.allowance')}</span>
            <Banknote className="w-4 h-4 text-cc-lime shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cc-forest tabular-nums break-words leading-tight">
            {formatMoney(allowance, profile?.currency)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cc-muted uppercase truncate">{t('app.dashboard.savingsGoal')}</span>
            <PiggyBank className="w-4 h-4 text-cc-lime shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cc-forest tabular-nums break-words leading-tight">
            {formatMoney(savingsGoal, profile?.currency)}
          </p>
        </div>
      </div>


      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-4">{t('app.dashboard.trendTitle')}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend6Months}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatMoney(value, profile?.currency)} />
                <Bar dataKey="income" fill="#5CB85C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#0B3D2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-cc-forest mb-1">{t('app.dashboard.topCategory')}</h2>
          <p className="text-sm text-cc-muted mb-3">
            {topCategory ? `${topCategory.name} - ${formatMoney(topCategory.amount || topCategory.value || 0, profile?.currency)}` : t('app.dashboard.noTransactions')}
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
                {t('app.dashboard.noTransactions')}
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-cc-forest flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cc-lime" /> {t('app.dashboard.aiTipsTitle')}
            </h2>
            <Link to="/app/insights" className="text-xs font-semibold text-cc-lime flex items-center gap-1">
              {t('app.dashboard.viewAll')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {localTips.length === 0 ? (
              <p className="text-sm text-cc-muted text-center py-4">{t('app.insights.noTips')}</p>
            ) : (
              localTips.map((tip) => {
                const isPinned = tip.isPinned || tip.pinned;
                const tipId = tip._id || tip.id;
                return (
                  <div key={tipId} className="flex gap-3 p-3 rounded-xl bg-cc-mint-soft border border-cc-mint items-start">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase text-cc-lime">{translateDynamicText(getTipImpact(tip), i18n.language)} {t('app.insights.impact')}</span>
                      <p className="text-sm text-cc-ink mt-0.5">{translateDynamicText(tip.text, i18n.language)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleBookmarkTip(tipId)}
                        className={`p-1.5 rounded-lg ${bookmarkedTipIds.has(tipId) ? 'bg-cc-mint text-cc-lime' : 'text-cc-muted hover:bg-gray-50'}`}
                        title={bookmarkedTipIds.has(tipId) ? t('app.insights.alreadyBookmarked') : t('app.insights.saveToBookmarks')}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarkedTipIds.has(tipId) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleTipPin(tipId)}
                        className={`p-1.5 rounded-lg ${isPinned ? 'bg-cc-mint text-cc-lime' : 'text-cc-muted hover:bg-gray-50'}`}
                        title={isPinned ? t('app.dashboard.unpinTip') : t('app.dashboard.pinTip')}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismissTip(tipId)}
                        className="p-1.5 rounded-lg text-cc-muted hover:bg-red-50 hover:text-red-500"
                        title={t('app.dashboard.dismissTip')}
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
            <h2 className="font-bold text-cc-forest">{t('app.budgets.title')}</h2>
            <Link to="/app/budgets" className="text-xs font-semibold text-cc-lime">
              {t('student.actions')}
            </Link>
          </div>
          {alerts.length > 0 && (
            <div className="mb-3 flex items-start gap-2 text-amber-800 bg-amber-50 rounded-xl px-3 py-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {alerts.length} {t('app.budgets.nearLimit')}
            </div>
          )}
          <div className="space-y-3">
            {(budgets || []).length === 0 ? (
              <p className="text-sm text-cc-muted text-center py-4">{t('app.budgets.noBudgets')}</p>
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
                        {formatMoney(spent, profile?.currency)} / {formatMoney(limit, profile?.currency)}
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


      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-cc-forest">{t('app.dashboard.recentTitle')}</h2>
            <Link to="/app/transactions" className="text-xs font-semibold text-cc-lime">
              {t('app.dashboard.viewAll')}
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <p className="text-sm text-cc-muted text-center py-4">{t('app.dashboard.noTransactions')} <Link to="/app/transactions" className="text-cc-lime font-semibold">{t('app.transactions.addTransaction')}</Link></p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-cc-muted border-b border-gray-100">
                    <th className="pb-2 font-semibold">{t('app.transactions.date')}</th>
                    <th className="pb-2 font-semibold">{t('app.transactions.note')}</th>
                    <th className="pb-2 font-semibold">{t('app.transactions.category')}</th>
                    <th className="pb-2 font-semibold text-right">{t('app.transactions.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tItem) => (
                    <tr key={getTxId(tItem)} className="border-b border-gray-50">
                      <td className="py-2.5 text-cc-muted whitespace-nowrap">
                        {tItem.date ? new Date(tItem.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-2.5 font-medium text-cc-ink">{tItem.description}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs bg-cc-mint text-cc-forest px-2 py-0.5 rounded-full font-medium">
                          <CategoryIcon
                            iconKey={tItem.category?.icon}
                            color={tItem.category?.color}
                            className="w-3 h-3"
                            size={20}
                          />
                          {getCatName(tItem)}
                        </span>
                      </td>
                      <td className={`py-2.5 text-right font-bold ${tItem.type === 'income' ? 'text-cc-lime' : 'text-cc-ink'}`}>
                        {tItem.type === 'income' ? '+' : '−'}
                        {formatMoney(tItem.amount, profile?.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-cc-forest">{t('app.dashboard.recentActivity')}</h2>
            <Link to="/app/transactions" className="text-xs font-semibold text-cc-lime">
              {t('app.dashboard.viewAll')}
            </Link>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-cc-muted text-center py-4">{t('app.dashboard.noActivity')}</p>
          ) : (
            <ul className="space-y-2.5">
              {activities.slice(0, 8).map((a) => {
                const tx = a.transaction || {};
                const actionLabel =
                  a.action === 'edit'
                    ? t('app.dashboard.activityEdited')
                    : a.action === 'create'
                    ? t('app.dashboard.activityCreated')
                    : t('app.dashboard.activityViewed');
                return (
                  <li
                    key={a.logId || `${a.action}-${tx._id}-${a.at}`}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase text-cc-lime">{actionLabel}</p>
                      <p className="text-sm font-semibold text-cc-forest truncate">
                        {tx.description || t('app.transactions.transactionWord')}
                      </p>
                      <p className="text-[11px] text-cc-muted">
                        {getCatName(tx)} · {a.at ? new Date(a.at).toLocaleString() : ''}
                      </p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${tx.type === 'income' ? 'text-cc-lime' : 'text-cc-ink'}`}>
                      {tx.type === 'income' ? '+' : '−'}{formatMoney(tx.amount || 0, profile?.currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
