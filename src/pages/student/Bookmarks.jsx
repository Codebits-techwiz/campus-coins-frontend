import { useState, useEffect } from 'react';
import { Bookmark, Pencil, Trash2, Loader2, Pin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { translateDynamicText } from '../../utils/translateDynamicText';

export default function Bookmarks() {
  const { t, i18n } = useTranslation();
  const { showToast } = useApp();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/api/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      showToast(t('common.loading'), 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('app.transactions.confirmDelete'))) return;
    try {
      await api.delete(`/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      showToast(t('app.bookmarks.remove'), 'success');
    } catch (err) {
      showToast(t('common.loading'), 'error');
    }
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setEditNote(b.note || '');
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.patch(`/api/bookmarks/${id}`, { note: editNote });
      if (res.data.success) {
        setBookmarks((prev) =>
          prev.map((b) => (b._id === id ? { ...b, note: editNote } : b))
        );
        showToast(t('app.profile.savedSuccess'), 'success');
      }
    } catch (err) {
      showToast(t('common.loading'), 'error');
    }
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-cc-lime" /> {t('app.bookmarks.title')}
        </h1>
        <p className="text-sm text-cc-muted mt-1">
          {t('app.bookmarks.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-cc-lime" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-cc-muted">
          {t('app.bookmarks.noBookmarks')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookmarks.map((b) => {
            const isTip = b.refType === 'tip';
            const title = isTip ? t('app.insights.pinnedTips') : t('app.insights.title');
            const item = b.ref || (isTip ? b.tip : b.insight);

            let contentText = isTip ? t('app.bookmarks.tipUnavailable') : t('app.bookmarks.insightUnavailable');
            if (item) {
              contentText = item.summaryText || item.text || contentText;
            }
            contentText = translateDynamicText(contentText, i18n.language);

            return (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-cc-mint text-cc-forest text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                      {title}
                    </span>
                    <span className="text-[11px] text-cc-muted">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(b)}
                      className="text-cc-muted hover:text-cc-forest transition"
                      title={t('app.transactions.edit')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-cc-muted hover:text-red-500 transition"
                      title={t('app.bookmarks.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 flex-1">
                  <p className="text-sm text-cc-ink line-clamp-4">{contentText}</p>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-auto">
                  {editingId === b._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder={t('app.bookmarks.notePlaceholder')}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-cc-lime"
                        autoFocus
                      />
                      <Button onClick={() => saveEdit(b._id)} className="!py-1 !px-3 !rounded-lg !text-xs">
                        {t('app.categories.save')}
                      </Button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-cc-muted font-medium px-2">{t('chatbot.close')}</button>
                    </div>
                  ) : (
                    <p className="text-sm">
                      <strong className="text-xs uppercase text-cc-muted mr-1 font-bold">{t('app.transactions.note')}:</strong>
                      <span className={b.note ? 'text-cc-forest' : 'text-gray-400 italic'}>
                        {b.note || '—'}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
