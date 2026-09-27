import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Bell, Plus, Trash2, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatPkr } from '../../utils/currency';
import { CategoryIcon } from '../../utils/categoryIcons';

export default function Budgets() {
  const { t } = useTranslation();
  const {
    budgets,
    addBudget,
    deleteBudget,
    categories,
    monthSpent,
    notifications,
    unreadCount,
    markNotificationRead,
    showToast,
    profile,
  } = useApp();

  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const expenseCats = categories.filter((c) => c.type === 'expense');

  const getId = (b) => b._id || b.id;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await addBudget({
      category: categoryId,
      month: currentMonth,
      limitAmount: Number(limit),
    });
    setSubmitting(false);
    if (ok) {
      setCategoryId('');
      setLimit('');
    }
  };


  const budgetNotifs = notifications.filter(
    (n) => n.type === 'budget_alert' || n.type === 'anomaly'
  );

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest flex items-center gap-2">
          <Target className="w-7 h-7 text-cc-lime" /> {t('app.budgets.title')}
        </h1>
        <p className="text-sm text-cc-muted mt-1">
          {t('app.budgets.subtitle')}
        </p>
      </div>


      {budgetNotifs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> {t('app.budgets.notifications')}
              {unreadCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {t('app.budgets.newCount', { count: unreadCount })}
                </span>
              )}
            </p>
          </div>
          {budgetNotifs.map((n) => (
            <div
              key={n._id || n.id}
              className={`flex items-start justify-between gap-3 px-3 py-2 rounded-xl text-xs ${
                n.isRead ? 'bg-white text-cc-muted' : 'bg-amber-100 text-amber-900 font-medium'
              }`}
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                <p>{n.message}</p>
              </div>
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(n._id || n.id)}
                  className="shrink-0 text-amber-600 hover:text-amber-800"
                  title={t('app.budgets.markRead')}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}


      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.category')}</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
          >
            <option value="">{t('app.transactions.select')}</option>
            {expenseCats.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-36">
          <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.budgets.limitPkr')}</label>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
          />
        </div>
        <Button type="submit" disabled={submitting} className="!rounded-xl">
          <Plus className="w-4 h-4" /> {submitting ? t('app.budgets.saving') : t('app.budgets.saveBudget')}
        </Button>
      </form>


      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-cc-muted">
            {t('app.budgets.noBudgetsHint')}
          </div>
        ) : (
          budgets.map((b) => {

            const spent = b.currentSpent ?? monthSpent(b.category?._id || b.categoryId);
            const lim   = b.limitAmount ?? b.limit ?? 1;
            const pct   = Math.min(100, Math.round((spent / lim) * 100));
            const near  = pct >= 80;
            const over  = spent >= lim;
            const catName = b.category?.name || b.category || '-';
            const catIcon = b.category?.icon || '';

            return (
              <div key={getId(b)} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-cc-forest flex items-center gap-2">
                      <CategoryIcon iconKey={b.category?.icon} color={b.category?.color} className="w-4 h-4" />
                      {catName}
                    </h3>
                    <p className="text-xs text-cc-muted">{monthLabel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-extrabold text-cc-ink">
                        {formatPkr(spent)}{' '}
                        <span className="text-cc-muted font-medium text-sm">
                          / {formatPkr(lim)}
                        </span>
                      </p>
                      {near && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${
                            over ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                          {over ? t('app.budgets.overBudget') : t('app.budgets.nearLimit', { pct })}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteBudget(getId(b))}
                      className="p-1.5 text-cc-muted hover:text-red-500 transition"
                      title={t('app.budgets.removeBudget')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      over ? 'bg-red-500' : near ? 'bg-amber-400' : 'bg-cc-lime'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-cc-muted mt-2">{t('app.budgets.consumed', { pct })}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
