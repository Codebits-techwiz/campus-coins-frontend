import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Sparkles } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';

export default function AdminTipTemplates() {
  const { showToast } = useApp();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: null, ruleType: 'spending_spike', template: '', defaultIsActive: true });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/api/admin/tip-templates');
      if (res.data.success) setTemplates(res.data.data);
    } catch (err) {
      showToast('Failed to load tip templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ id: null, ruleType: 'spending_spike', template: '', defaultIsActive: true });
    setShow(true);
  };
  
  const openEdit = (t) => {
    setForm({ id: t._id, ruleType: t.ruleType, template: t.template, defaultIsActive: t.defaultIsActive });
    setShow(true);
  };
  
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        const res = await api.put(`/api/admin/tip-templates/${form.id}`, { ruleType: form.ruleType, template: form.template, defaultIsActive: form.defaultIsActive });
        if (res.data.success) {
          showToast('Template updated', 'success');
          fetchTemplates();
          setShow(false);
        }
      } else {
        const res = await api.post('/api/admin/tip-templates', { ruleType: form.ruleType, template: form.template, defaultIsActive: form.defaultIsActive });
        if (res.data.success) {
          showToast('Template created', 'success');
          fetchTemplates();
          setShow(false);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save template', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tip template?')) return;
    try {
      const res = await api.delete(`/api/admin/tip-templates/${id}`);
      if (res.data.success) {
        showToast('Template deleted', 'success');
        fetchTemplates();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete template', 'error');
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cc-lime" /></div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">AI Tip Templates</h1>
          <p className="text-sm text-cc-muted">Define templates used by the insights engine</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border p-5 space-y-3 relative shadow-sm">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4" />
          </button>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Rule Type</label>
            <select
              value={form.ruleType}
              onChange={(e) => setForm({ ...form, ruleType: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            >
              <option value="spending_spike">Spending Spike</option>
              <option value="budget_warning">Budget Warning</option>
              <option value="positive_reinforcement">Positive Reinforcement</option>
              <option value="general_advice">General Advice</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Template Text</label>
            <p className="text-[10px] text-gray-500 mb-1">Use [[CATEGORY]] or [[AMOUNT]] as placeholders</p>
            <textarea
              required
              rows={3}
              value={form.template}
              onChange={(e) => setForm({ ...form, template: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.defaultIsActive}
              onChange={(e) => setForm({ ...form, defaultIsActive: e.target.checked })}
              className="accent-cc-lime"
            />
            Active by default
          </label>
          <Button type="submit" disabled={saving} className="!rounded-xl">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative pr-20">
            <div className="absolute right-4 top-4 flex gap-1">
              <button onClick={() => openEdit(t)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t._id)} className="p-1.5 text-cc-muted hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cc-lime" />
              <h3 className="font-bold text-cc-forest capitalize">{t.ruleType.replace('_', ' ')}</h3>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  t.defaultIsActive ? 'bg-cc-mint text-cc-lime-dark' : 'bg-gray-100 text-cc-muted'
                }`}
              >
                {t.defaultIsActive ? 'Active' : 'Off'}
              </span>
            </div>
            <p className="text-sm text-cc-muted">{t.template}</p>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="p-8 text-center text-sm text-cc-muted bg-white border border-dashed rounded-xl">No tip templates found.</div>
        )}
      </div>
    </div>
  );
}
