import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { iconMap, PRESET_COLORS, CategoryIcon } from '../../utils/categoryIcons';
import { translateDynamicText } from '../../utils/translateDynamicText';

export default function Categories() {
  const { t, i18n } = useTranslation();
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'expense', icon: 'tag', color: '#6B7280' });
  const [loading, setLoading] = useState(false);
  
  const [showIconPicker, setShowIconPicker] = useState(false);
  const iconPickerRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target)) {
        setShowIconPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const getId = (c) => c._id || c.id;

  const personal = categories.filter((c) => !c.isDefault);
  const defaults = categories.filter((c) => c.isDefault);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', type: 'expense', icon: 'tag', color: '#6B7280' });
    setShow(true);
  };

  const openEdit = (c) => {
    setEditId(getId(c));
    setForm({ name: c.name, type: c.type, icon: c.icon || 'tag', color: c.color || '#6B7280' });
    setShow(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editId) await updateCategory(editId, form);
    else await addCategory(form);
    setLoading(false);
    setShow(false);
  };

  const CatList = ({ items, allowEdit }) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((c) => (
        <div key={getId(c)} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CategoryIcon iconKey={c.icon} color={c.color} className="w-5 h-5" />
            <div>
              <p className="font-semibold text-cc-forest">{translateDynamicText(c.name, i18n.language)}</p>
              <p className="text-xs text-cc-muted capitalize">{c.type} / {c.isDefault ? 'Default' : 'Personal'}</p>
            </div>
          </div>
          {allowEdit && (
            <div className="flex gap-1">
              <button type="button" onClick={() => openEdit(c)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => deleteCategory(getId(c))} className="p-1.5 text-cc-muted hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">{t('app.categories.title')}</h1>
          <p className="text-sm text-cc-muted">{t('app.categories.subtitle')}</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> {t('app.categories.addCategory')}
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-md flex flex-wrap gap-4 items-end relative">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4 text-cc-muted" />
          </button>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs font-semibold text-cc-muted uppercase">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
            />
          </div>
          <div className="relative" ref={iconPickerRef}>
            <label className="text-xs font-semibold text-cc-muted uppercase">Icon</label>
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full flex items-center justify-center h-[42px] px-3 rounded-xl border border-gray-200 hover:border-cc-lime transition"
              >
                <CategoryIcon iconKey={form.icon} color={form.color} />
              </button>
            </div>
            {showIconPicker && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-64">
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(iconMap).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setForm({ ...form, icon: key }); setShowIconPicker(false); }}
                      className={`p-2 rounded-lg flex items-center justify-center hover:bg-gray-50 transition ${form.icon === key ? 'ring-2 ring-cc-lime bg-cc-mint-soft' : ''}`}
                    >
                      <CategoryIcon iconKey={key} color={form.icon === key ? form.color : '#9CA3AF'} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Color</label>
            <div className="mt-1 flex items-center gap-1.5 h-[42px]">
              {PRESET_COLORS.map(c => (
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
                  title="Custom Color"
                />
              </div>
            </div>
          </div>
          <div className="w-40">
            <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <Button type="submit" disabled={loading} className="!rounded-xl">
            {loading ? 'Saving...' : editId ? 'Save' : 'Create'}
          </Button>
        </form>
      )}

      <section>
        <h2 className="font-bold text-cc-forest mb-3">Your Personal Categories</h2>
        {personal.length === 0 ? (
          <p className="text-sm text-cc-muted bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
            No personal categories yet. Add ones like &ldquo;Campus Cafe&rdquo; or &ldquo;Freelance&rdquo;.
          </p>
        ) : (
          <CatList items={personal} allowEdit />
        )}
      </section>

      <section>
        <h2 className="font-bold text-cc-forest mb-3">System Default Categories</h2>
        <p className="text-xs text-cc-muted mb-3">Provided to all students. View only (admin can edit defaults)</p>
        <CatList items={defaults} allowEdit={false} />
      </section>
    </div>
  );
}
