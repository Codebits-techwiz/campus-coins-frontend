import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { CategoryIcon, iconMap, PRESET_COLORS } from '../../utils/categoryIcons';

export default function AdminCategories() {
  const { showToast } = useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', type: 'expense', icon: 'tag', color: '#6B7280' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data.filter(c => c.isDefault));
      }
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ id: null, name: '', type: 'expense', icon: 'tag', color: '#6B7280' });
    setShow(true);
  };
  const openEdit = (c) => {
    setForm({ id: c._id, name: c.name, type: c.type, icon: c.icon || 'tag', color: c.color || '#6B7280' });
    setShow(true);
  };
  
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        const res = await api.put(`/api/admin/categories/${form.id}`, { name: form.name, type: form.type, icon: form.icon, color: form.color });
        if (res.data.success) {
          showToast('Category updated successfully', 'success');
          fetchCategories();
          setShow(false);
        }
      } else {
        const res = await api.post('/api/admin/categories', { name: form.name, type: form.type, icon: form.icon, color: form.color });
        if (res.data.success) {
          showToast('Category created successfully', 'success');
          fetchCategories();
          setShow(false);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this system category?')) return;
    try {
      const res = await api.delete(`/api/admin/categories/${id}`);
      if (res.data.success) {
        showToast('Category deleted', 'success');
        fetchCategories();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete category', 'error');
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cc-lime" /></div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Default Categories</h1>
          <p className="text-sm text-cc-muted">Available to all students system-wide</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> Add Default
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border p-5 flex flex-wrap gap-3 items-end relative">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-semibold text-cc-muted uppercase">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <div className="w-36">
            <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Icon</label>
            <div className="mt-1 flex items-center gap-2">
              <CategoryIcon iconKey={form.icon} color={form.color} className="w-4 h-4" size={36} />
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
              >
                {Object.keys(iconMap).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Color</label>
            <div className="mt-1 flex items-center gap-1.5 h-[42px]">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-6 h-6 rounded-full border-2 ${form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 ml-1">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={saving} className="!rounded-xl h-[42px] px-6">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {categories.map((c) => (
          <div key={c._id} className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <CategoryIcon iconKey={c.icon} color={c.color} className="w-4 h-4" />
              <div>
                <p className="font-semibold text-cc-forest">{c.name}</p>
                <p className="text-xs text-cc-muted capitalize">{c.type}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => openEdit(c)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => deleteCategory(c._id)} className="p-1.5 text-cc-muted hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-2 p-8 text-center text-sm text-cc-muted">No default categories defined.</div>
        )}
      </div>
    </div>
  );
}
