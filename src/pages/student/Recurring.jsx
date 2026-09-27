import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CalendarClock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatMoney } from '../../utils/formatMoney';
import { translateDynamicText } from '../../utils/translateDynamicText';

const emptyForm = {
  categoryId: '',
  type: 'expense',
  amount: '',
  description: '',
  frequency: 'monthly',
  nextRunDate: new Date().toISOString().slice(0, 10),
  isActive: true,
};

export default function Recurring() {
  const { t, i18n } = useTranslation();
  const { categories, showToast, profile } = useApp();
  const [rules, setRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/recurring');
      if (res.data.success) {
        setRules(res.data.data);
      }
    } catch (err) {
      showToast(t('common.loading'), 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (rule) => {
    setEditing(rule._id);
    setForm({
      categoryId: rule.category?._id || rule.category || '',
      type: rule.type,
      amount: String(rule.amount),
      description: rule.description,
      frequency: rule.frequency,
      nextRunDate: rule.nextRunDate ? rule.nextRunDate.slice(0, 10) : '',
      isActive: rule.isActive
    });
    setShowForm(true);
  };

  const deleteRule = async (id) => {
    if (!window.confirm(t('app.transactions.confirmDelete'))) return;
    try {
      const res = await api.delete(`/api/recurring/${id}`);
      if (res.data.success) {
        showToast(t('app.transactions.delete'), 'success');
        setRules(rules.filter(r => r._id !== id));
      }
    } catch (err) {
      showToast(t('common.loading'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { categoryId, ...restForm } = form;
    const payload = { ...restForm, category: categoryId, amount: Number(form.amount) };
    try {
      let res;
      if (editing) {
        res = await api.put(`/api/recurring/${editing}`, payload);
      } else {
        res = await api.post('/api/recurring', payload);
      }
      if (res.data.success) {
        showToast(`Rule ${editing ? 'updated' : 'added'} successfully`, 'success');
        setShowForm(false);
        fetchRules();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save rule', 'error');
    }
    setSubmitting(false);
  };

  const getCatName = (rule) => rule.category?.name || '—';

  return (
    <>
      <div className="animate-fade-in space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-cc-forest flex items-center gap-2">
              <CalendarClock className="w-6 h-6" /> {t('studentNav.recurring')}
            </h1>
            <p className="text-sm text-cc-muted">{t('app.recurring.subtitle')}</p>
          </div>
          <Button onClick={openAdd} className="!rounded-xl">
            <Plus className="w-4 h-4" /> {t('app.recurring.addRecurring')}
          </Button>
        </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6 mb-8">
        {loading ? (
           <p className="text-sm text-cc-muted text-center p-8">{t('common.loading')}</p>
        ) : rules.length === 0 ? (
          <p className="text-sm text-cc-muted text-center p-8">
            {t('app.budgets.noBudgets')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cc-mint-soft">
                <tr className="text-left text-xs text-cc-muted">
                  <th className="px-4 py-3 font-semibold">{t('app.transactions.note')}</th>
                  <th className="px-4 py-3 font-semibold">{t('app.transactions.category')}</th>
                  <th className="px-4 py-3 font-semibold">{t('app.recurring.frequency')}</th>
                  <th className="px-4 py-3 font-semibold">{t('app.recurring.nextDue')}</th>
                  <th className="px-4 py-3 font-semibold">{t('app.recurring.status')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('app.transactions.amount')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('app.transactions.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r._id} className="border-t border-gray-50 hover:bg-cc-mint-soft/50">
                    <td className="px-4 py-3 font-medium">{r.description}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-cc-mint text-cc-forest px-2 py-0.5 rounded-full">
                        {translateDynamicText(getCatName(r), i18n.language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs font-semibold text-cc-muted">
                      {r.frequency === 'monthly' ? t('app.recurring.monthly') : t('app.recurring.weekly')}
                    </td>
                    <td className="px-4 py-3 text-cc-muted whitespace-nowrap">
                      {r.nextRunDate ? new Date(r.nextRunDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.isActive ? t('app.recurring.active') : t('app.recurring.paused')}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${r.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                      {r.type === 'income' ? '+' : '-'}{formatMoney(Number(r.amount || 0), profile?.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(r)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteRule(r._id)} className="p-1.5 text-cc-muted hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <button type="button" className="absolute right-4 top-4 p-1 text-cc-muted hover:text-red-500 rounded-full hover:bg-red-50 transition" onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-cc-forest mb-4">{editing ? 'Edit' : 'Add'} Recurring Rule</h2>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, categoryId: '' })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Amount ({profile?.currency || 'USD'})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-cc-muted uppercase">Description</label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Netflix Subscription"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Category</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="">Select…</option>
                  {categories.filter(c => c.type === form.type).map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Frequency</label>
                <select
                  required
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Next Run Date</label>
                <input
                  type="date"
                  required
                  value={form.nextRunDate}
                  onChange={(e) => setForm({ ...form, nextRunDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <div className="flex items-end mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-cc-lime focus:ring-cc-lime"
                  />
                  <span className="text-sm font-semibold text-cc-ink">Active</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={submitting} className="!rounded-xl">
                  {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Rule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
