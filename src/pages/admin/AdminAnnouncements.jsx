import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Megaphone,
  Bell,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  Eye,
  Calendar,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';

const CATEGORIES = [
  { id: 'General', label: 'General Info', icon: Info, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Campus Life', label: 'Campus Life', icon: Sparkles, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Exam & Fees', label: 'Exam & Fees', icon: Tag, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'System Update', label: 'System Update', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const PRIORITIES = [
  { id: 'normal', label: 'Normal Priority', badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'important', label: 'Important ⚡', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'urgent', label: 'Urgent 🚨', badgeClass: 'bg-red-100 text-red-800 border-red-300 animate-pulse' },
];

export default function AdminAnnouncements() {
  const { showToast } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: '',
    message: '',
    category: 'General',
    priority: 'normal',
    isActive: true,
  });

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
    setForm({
      id: null,
      title: '',
      message: '',
      category: 'General',
      priority: 'normal',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setForm({
      id: a._id,
      title: a.title || '',
      message: a.message || '',
      category: a.category || 'General',
      priority: a.priority || 'normal',
      isActive: a.isActive ?? true,
    });
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      showToast('Please provide both Title and Message', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        message: form.message,
        category: form.category,
        priority: form.priority,
        isActive: form.isActive,
      };

      if (form.id) {
        const res = await api.put(`/api/admin/announcements/${form.id}`, payload);
        if (res.data.success) {
          showToast('Announcement updated successfully', 'success');
          fetchAnnouncements();
          setShowModal(false);
        }
      } else {
        const res = await api.post('/api/admin/announcements', payload);
        if (res.data.success) {
          showToast('Announcement broadcasted successfully', 'success');
          fetchAnnouncements();
          setShowModal(false);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save announcement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
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
        showToast(`Announcement turned ${!currentStatus ? 'Active' : 'Off'}`, 'success');
        fetchAnnouncements();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const activeCount = announcements.filter((a) => a.isActive).length;
  const urgentCount = announcements.filter((a) => a.isActive && a.priority === 'urgent').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cc-lime" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl mx-auto pb-12">
      {/* Executive Banner & Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cc-mint text-cc-forest font-bold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-cc-lime" /> Campus Broadcast System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cc-forest tracking-tight mt-1.5 flex items-center gap-3">
            Announcements & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-cc-muted mt-1">
            Broadcast official notices, fee reminders, and campus updates directly to all student dashboards.
          </p>
        </div>
        <Button onClick={openAdd} className="!rounded-xl shadow-md shrink-0">
          <Plus className="w-4 h-4" /> Create Broadcast
        </Button>
      </div>

      {/* Analytics Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-forest flex items-center justify-center font-bold text-xl shrink-0">
            {announcements.length}
          </div>
          <div>
            <p className="text-xs text-cc-muted uppercase font-bold">Total Broadcasts</p>
            <p className="text-sm font-extrabold text-cc-forest mt-0.5">All Created Messages</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0 border border-emerald-200">
            {activeCount}
          </div>
          <div>
            <p className="text-xs text-emerald-700 uppercase font-bold">Live & Active</p>
            <p className="text-sm font-extrabold text-cc-forest mt-0.5">Visible on Dashboards</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-xl shrink-0 border border-red-200">
            {urgentCount}
          </div>
          <div>
            <p className="text-xs text-red-700 uppercase font-bold">Urgent Alerts</p>
            <p className="text-sm font-extrabold text-cc-forest mt-0.5">High Priority Broadcasts</p>
          </div>
        </div>
      </div>

      {/* Modal / Form Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl p-6 space-y-5 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cc-forest text-cc-lime flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-cc-forest">
                    {form.id ? 'Edit Announcement' : 'Create New Broadcast'}
                  </h3>
                  <p className="text-xs text-cc-muted">Configure title, details, priority tag, and live state.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-cc-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-cc-forest uppercase tracking-wider">Title / Headline</label>
                <input
                  required
                  placeholder="e.g. Midterm Examination Schedule & Fee Deadline"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cc-lime text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-cc-forest uppercase tracking-wider">Category Tag</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cc-lime text-sm bg-white font-medium text-cc-forest"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-cc-forest uppercase tracking-wider">Priority Level</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cc-lime text-sm bg-white font-medium text-cc-forest"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cc-forest uppercase tracking-wider">Announcement Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write clear details for the students..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cc-lime text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-cc-forest rounded"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-cc-forest cursor-pointer">
                    Publish Immediately (Active on Student Dashboards)
                  </label>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${form.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                  {form.isActive ? 'Active' : 'Draft'}
                </span>
              </div>

              {/* Real-time Student View Preview */}
              <div className="pt-2">
                <span className="text-xs font-bold text-cc-muted uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-cc-lime" /> Live Student View Preview:
                </span>
                <div className="bg-cc-forest text-white rounded-2xl p-4 shadow-md space-y-2 border border-cc-lime/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-cc-lime text-cc-forest font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {form.category} • {form.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/60">Just Now</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{form.title || 'Your Title Here...'}</h4>
                  <p className="text-xs text-white/85 leading-relaxed">{form.message || 'Your announcement message preview will appear here...'}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {form.id ? 'Update Announcement' : 'Publish Broadcast'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-cc-forest flex items-center gap-2">
            <Bell className="w-5 h-5 text-cc-lime" /> Broadcast Queue ({announcements.length})
          </h2>
        </div>

        {announcements.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
            <Megaphone className="w-10 h-10 text-cc-muted mx-auto opacity-40" />
            <p className="text-sm font-bold text-cc-forest">No broadcasts found</p>
            <p className="text-xs text-cc-muted">Click &quot;Create Broadcast&quot; above to send your first message to students.</p>
          </div>
        ) : (
          announcements.map((a) => {
            const categoryObj = CATEGORIES.find((c) => c.id === a.category) || CATEGORIES[0];
            const priorityObj = PRIORITIES.find((p) => p.id === a.priority) || PRIORITIES[0];
            const CategoryIcon = categoryObj.icon;

            return (
              <div
                key={a._id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                  a.isActive ? 'border-gray-100' : 'border-gray-200 bg-gray-50/50 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${categoryObj.color} flex items-center gap-1`}>
                        <CategoryIcon className="w-3 h-3" />
                        {a.category || 'General'}
                      </span>

                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${priorityObj.badgeClass}`}>
                        {priorityObj.label}
                      </span>

                      <span className="text-[11px] text-cc-muted flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3 text-cc-muted" />
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-cc-forest tracking-tight">{a.title}</h3>
                    <p className="text-xs sm:text-sm text-cc-muted leading-relaxed whitespace-pre-line">{a.message}</p>
                    
                    {a.createdBy?.name && (
                      <p className="text-[11px] text-cc-muted/80 font-medium">
                        Posted by: <span className="text-cc-forest font-bold">{a.createdBy.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(a._id, a.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-extrabold transition shadow-sm border ${
                        a.isActive
                          ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                          : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {a.isActive ? '● Active Live' : '○ Disabled'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="p-2 rounded-xl text-cc-forest hover:bg-cc-mint border border-gray-200 transition"
                        title="Edit Announcement"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a._id)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

