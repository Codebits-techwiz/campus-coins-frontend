import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';

export default function AdminAnnouncements() {
  const { showToast } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', message: '', isActive: true });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/api/admin/announcements');
      if (res.data.success) setAnnouncements(res.data.data);
    } catch (err) {
      showToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ id: null, title: '', message: '', isActive: true });
    setShow(true);
  };
  const openEdit = (a) => {
    setForm({ id: a._id, title: a.title, message: a.message, isActive: a.isActive });
    setShow(true);
  };
  
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        const res = await api.put(`/api/admin/announcements/${form.id}`, { title: form.title, message: form.message, isActive: form.isActive });
        if (res.data.success) {
          showToast('Announcement updated', 'success');
          fetchAnnouncements();
          setShow(false);
        }
      } else {
        const res = await api.post('/api/admin/announcements', { title: form.title, message: form.message, isActive: form.isActive });
        if (res.data.success) {
          showToast('Announcement created', 'success');
          fetchAnnouncements();
          setShow(false);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save announcement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await api.delete(`/api/admin/announcements/${id}`);
      if (res.data.success) {
        showToast('Announcement deleted', 'success');
        fetchAnnouncements();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete announcement', 'error');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await api.patch(`/api/admin/announcements/${id}`, { isActive: !currentStatus });
      if (res.data.success) {
        showToast('Status updated', 'success');
        fetchAnnouncements();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-cc-lime" /></div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">Announcements</h1>
          <p className="text-sm text-cc-muted">System-wide messages shown on student dashboards</p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl">
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border p-5 space-y-3 relative">
          <button type="button" className="absolute right-3 top-3" onClick={() => setShow(false)}>
            <X className="w-4 h-4" />
          </button>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Message</label>
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="accent-cc-lime"
            />
            Active
          </label>
          <Button type="submit" disabled={saving} className="!rounded-xl">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-cc-forest">{a.title}</h3>
                  <button onClick={() => handleToggle(a._id, a.isActive)}>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        a.isActive ? 'bg-cc-mint text-cc-lime-dark' : 'bg-gray-100 text-cc-muted'
                      }`}
                    >
                      {a.isActive ? 'Active' : 'Off'}
                    </span>
                  </button>
                </div>
                <p className="text-sm text-cc-muted">{a.message}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(a)} className="p-1.5 text-cc-muted hover:text-cc-lime">
                  <Pencil className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => handleDelete(a._id)} className="p-1.5 text-cc-muted hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="p-8 text-center text-sm text-cc-muted bg-white border border-dashed rounded-xl">No announcements found.</div>
        )}
      </div>
    </div>
  );
}
