import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Sparkles, X, Search, FileUp, UploadCloud, Camera, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { CategorySelect } from '../../components/CategorySelect';
import { formatMoney, toDateInputLocal } from '../../utils/formatMoney';
import { CategoryIcon } from '../../utils/categoryIcons';
import { getFriendlyError } from '../../utils/friendlyError';

const empty = {
  type: 'expense',
  categoryId: '',
  amount: '',
  description: '',
  date: toDateInputLocal(),
};

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    showToast,
    profile,
    refreshAllAppData,
  } = useApp();

  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [aiHint, setAiHint] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const [showCsvForm, setShowCsvForm] = useState(false);
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);

  const [ocrUploading, setOcrUploading] = useState(false);

  useEffect(() => {
    if (searchParams.get('import') === 'csv') {
      setShowCsvForm(true);
      setShowForm(false);
      setCsvPreview(null);
      setCsvFile(null);
      const next = new URLSearchParams(searchParams);
      next.delete('import');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const getId = (t) => t._id || t.id;
  const getCatId = (t) => t.category?._id || t.category;
  const getCatName = (t) => t.category?.name || t.category || '-';


  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    api.get('/api/templates')
      .then(res => {
        if (res.data.success) {
          setTemplates(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Debounced API AI suggestion
  useEffect(() => {
    if (form.type !== 'expense' || form.description.length < 3) {
      setAiHint(null);
      return;
    }
    const timer = setTimeout(() => {
      api.post('/api/ai/predict-category', { description: form.description })
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.suggestedCategoryId) {
            setAiHint(res.data.data);
          } else {
            setAiHint(null);
          }
        })
        .catch(() => setAiHint(null));
    }, 400);
    return () => clearTimeout(timer);
  }, [form.description, form.type]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
    setShowCsvForm(false);
  };

  const useTemplate = (t) => {
    setEditing(null);
    setForm({
      type: t.type,
      categoryId: getCatId(t) || '',
      amount: String(t.amount),
      description: t.name,
      date: toDateInputLocal(),
    });
    setShowForm(true);
    setShowCsvForm(false);
  };

  const openEdit = (t) => {
    setEditing(getId(t));
    setForm({
      type: t.type,
      categoryId: getCatId(t) || '',
      amount: String(t.amount),
      description: t.description,
      date: t.date ? t.date.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const openView = async (t) => {
    setViewing(true);
    setViewData(null);
    try {
      const res = await api.get(`/api/transactions/${getId(t)}`);
      if (res.data.success) {
        setViewData(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load transaction details', 'error');
      setViewing(false);
    }
  };

  const applyAi = () => {
    if (!aiHint) return;
    const targetCatId = aiHint.suggestedCategoryId || aiHint._id || aiHint.id;
    const targetCatName = (aiHint.categoryName || aiHint.name || '').toLowerCase();

    const matched = categories.find(c =>
      (c._id || c.id) === targetCatId ||
      c.name.toLowerCase() === targetCatName ||
      c.name.toLowerCase().includes(targetCatName) ||
      targetCatName.includes(c.name.toLowerCase())
    );

    if (matched) {
      setForm((f) => ({ ...f, categoryId: matched._id || matched.id }));
    } else if (targetCatId) {
      setForm((f) => ({ ...f, categoryId: targetCatId }));
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleTemplateEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/api/templates/${editingTemplate}`, {
        name: templateForm.name,
        amount: Number(templateForm.amount),
        type: templateForm.type,
        category: templateForm.category
      });
      if (res.data.success) {
        showToast('Template updated', 'success');
        setTemplates(prev => prev.map(t => getId(t) === editingTemplate ? res.data.data : t));
        setEditingTemplate(null);
      }
    } catch (err) {
      showToast('Failed to update template', 'error');
    }
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, amount: Number(form.amount) };

    // Check AI feedback (if user overrode the suggested category)
    if (aiHint && aiHint.suggestedCategoryId && payload.categoryId !== aiHint.suggestedCategoryId) {
      api.post('/api/ai/feedback', {
        description: payload.description,
        correctedCategoryId: payload.categoryId
      }).catch(console.error); // fire and forget
    }
    let ok = false;
    if (editing) {
      await updateTransaction(editing, payload);
      ok = true;
    } else {
      ok = await addTransaction(payload);
    }
    setSubmitting(false);
    if (ok) {
      setShowForm(false);
      setForm(empty);
      setEditing(null);
    }
  };

  const handleCsvSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/transactions/import-csv/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.data?.preview?.length > 0) {
        setCsvPreview(res.data.data.preview);
      } else {
        showToast('No valid rows found in CSV.', 'error');
      }
    } catch (err) {
      showToast(getFriendlyError(err, 'We couldn’t read that CSV file. Please check the format and try again.'), 'error');
    } finally {
      setCsvUploading(false);
      e.target.value = '';
    }
  };

  const updateCsvRow = (index, field, value) => {
    setCsvPreview(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const confirmCsvImport = async () => {
    // Validate rows
    for (const row of csvPreview) {
      const catId = row.categoryId || row.aiSuggestedCategory;
      if (!catId) {
        showToast('Please assign a category to all rows.', 'error');
        return;
      }
      row.categoryId = catId; // Set final category ID
    }
    
    setCsvUploading(true);
    try {
      const res = await api.post('/api/transactions/import-csv/confirm', { rows: csvPreview });
      if (res.data.success) {
        await refreshAllAppData();
        setShowCsvForm(false);
        setCsvPreview(null);
        setCsvFile(null);
        showToast(res.data.message || 'Transactions imported successfully', 'success');
      }
    } catch (err) {
      showToast(getFriendlyError(err, 'We couldn’t import those transactions. Please try again.'), 'error');
    } finally {
      setCsvUploading(false);
    }
  };

  const handleReceiptScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrUploading(true);
    showToast('Scanning receipt with AI...', 'success');
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await api.post('/api/transactions/scan-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.data?.extractedData) {
        const { amount, merchant, date } = res.data.data.extractedData;
        let formattedDate = empty.date;
        if (date) {
            try {
                formattedDate = toDateInputLocal(new Date(date));
            } catch(e) {}
        }
        setForm({
          ...empty,
          amount: amount ? String(amount) : '',
          description: merchant || '',
          date: formattedDate
        });
        setShowForm(true);
        setShowCsvForm(false);
        showToast('Receipt scanned successfully! Please review.', 'success');
      } else {
        showToast('Could not read receipt data.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to scan receipt', 'error');
    } finally {
      setOcrUploading(false);
      e.target.value = '';
    }
  };


  const typeCats = categories.filter((c) => c.type === form.type);


  const filtered = transactions.filter((t) => {
    const matchType = filter === 'all' || t.type === filter;
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <div className="animate-fade-in space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">{t('app.transactions.title')}</h1>
          <p className="text-sm text-cc-muted">{t('app.transactions.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <input type="file" accept="image/*" capture="environment" onChange={handleReceiptScan} className="hidden" id="receipt-upload" />
            <label htmlFor="receipt-upload" className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-cc-forest/20 text-cc-forest hover:border-cc-lime hover:text-cc-lime transition ${ocrUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Camera className="w-4 h-4" /> {ocrUploading ? t('app.transactions.scanning') : t('app.transactions.scanReceipt')}
            </label>
          </div>
          <Button variant="outline" onClick={() => { setShowCsvForm(true); setShowForm(false); setCsvPreview(null); setCsvFile(null); }} className="!rounded-xl border-2">
            <FileUp className="w-4 h-4" /> {t('app.transactions.importCsv')}
          </Button>
          <Button onClick={openAdd} className="!rounded-xl">
            <Plus className="w-4 h-4" /> {t('app.transactions.addTransaction')}
          </Button>
        </div>
      </div>

      {/* Quick Templates Bar */}
      {templates.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-extrabold text-cc-forest uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cc-lime shrink-0" /> {t('app.transactions.quickTemplates')}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {templates.map((tx) => (
              <div key={getId(tx)} className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => useTemplate(tx)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-cc-forest hover:border-cc-lime hover:bg-cc-mint-soft transition whitespace-nowrap pr-8"
                >
                  <CategoryIcon iconKey={tx.category?.icon} color={tx.category?.color} className="w-3.5 h-3.5 shrink-0" />
                  <span>{tx.name}</span>
                  <span className="text-cc-muted font-semibold">{formatMoney(Number(tx.amount), profile?.currency)}</span>
                </button>
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition bg-white/90 px-1 rounded-lg">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate(getId(tx));
                      setTemplateForm({
                        name: tx.name,
                        amount: String(tx.amount),
                        type: tx.type,
                        category: getCatId(tx) || '',
                      });
                    }}
                    className="p-1 hover:bg-cc-mint hover:text-cc-forest rounded-md text-cc-muted transition"
                    title={t('app.transactions.editTemplate')}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await api.delete(`/api/templates/${getId(tx)}`);
                        setTemplates((prev) => prev.filter((x) => getId(x) !== getId(tx)));
                        showToast('Template deleted', 'success');
                      } catch (err) {
                        showToast('Failed to delete template', 'error');
                      }
                    }}
                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded-md text-cc-muted transition"
                    title={t('app.transactions.delete')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Executive Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                filter === f
                  ? 'bg-cc-forest text-white shadow-sm ring-2 ring-cc-lime/30'
                  : 'bg-gray-50 text-cc-muted hover:bg-gray-100 hover:text-cc-forest border border-gray-200/60'
              }`}
            >
              {t(`app.transactions.${f}`)}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('app.transactions.searchPlaceholder')}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-cc-lime focus:ring-2 focus:ring-cc-lime/20 bg-gray-50/50 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cc-muted hover:text-cc-forest p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table & Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-4 mb-8">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2" dir="auto">
            <Search className="w-8 h-8 text-cc-muted mx-auto opacity-30" />
            <p className="text-sm font-bold text-cc-forest">
              {transactions.length === 0 ? t('app.transactions.noTransactionsYet') : t('app.transactions.noMatching')}
            </p>
            <p className="text-xs text-cc-muted">
              {transactions.length === 0
                ? t('app.transactions.noTransactionsHint')
                : t('app.transactions.noMatchingHint')}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cc-mint-soft border-b border-gray-100">
                  <tr className="text-left text-xs font-bold text-cc-forest uppercase tracking-wider">
                    <th className="px-4 py-3.5">{t('app.transactions.date')}</th>
                    <th className="px-4 py-3.5">{t('app.transactions.description')}</th>
                    <th className="px-4 py-3.5">{t('app.transactions.category')}</th>
                    <th className="px-4 py-3.5">{t('app.transactions.type')}</th>
                    <th className="px-4 py-3.5 text-right">{t('app.transactions.amount')}</th>
                    <th className="px-4 py-3.5 text-right">{t('app.transactions.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((tx) => (
                    <tr key={getId(tx)} className="hover:bg-cc-mint-soft/40 transition">
                      <td className="px-4 py-3.5 text-xs font-medium text-cc-muted whitespace-nowrap">
                        {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-cc-forest">
                        <span className="inline-flex items-center gap-1.5">
                          {tx.description}
                          {tx.isFlagged && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full"
                              title={tx.flagReason || t('app.transactions.flagged')}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {t('app.transactions.flagged')}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: tx.category?.color ? `${tx.category.color}15` : '#f0fdf4',
                            color: tx.category?.color || '#166534',
                          }}
                        >
                          <CategoryIcon iconKey={tx.category?.icon} color={tx.category?.color || '#166534'} className="w-3.5 h-3.5" />
                          {getCatName(tx)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-cc-muted">{t(`app.transactions.${tx.type}`)}</td>
                      <td className={`px-4 py-3.5 text-right font-extrabold ${tx.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatMoney(Number(tx.amount), profile?.currency)}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openView(tx)}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-cc-forest hover:bg-gray-100 transition"
                          title={t('app.transactions.viewDetails')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(tx)}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-cc-lime hover:bg-cc-mint transition"
                          title={t('app.transactions.editTransaction')}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(getId(tx))}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-red-600 hover:bg-red-50 transition"
                          title={t('app.transactions.deleteTransaction')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Executive Professional Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <div className="flex flex-wrap items-center gap-3 text-xs text-cc-muted font-medium">
                <span>
                  {t('app.transactions.showing')} <strong className="text-cc-forest">{(page - 1) * itemsPerPage + 1}</strong> {t('app.transactions.to')}{' '}
                  <strong className="text-cc-forest">{Math.min(page * itemsPerPage, filtered.length)}</strong> {t('app.transactions.of')}{' '}
                  <strong className="text-cc-forest">{filtered.length}</strong> {t('app.transactions.transactionsCount')}
                </span>

                <div className="flex items-center gap-1.5 border-l border-gray-300 pl-3">
                  <span>{t('app.transactions.show')}</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-cc-forest outline-none focus:border-cc-lime cursor-pointer shadow-sm"
                  >
                    <option value={5}>5 {t('app.transactions.rows')}</option>
                    <option value={10}>10 {t('app.transactions.rows')}</option>
                    <option value={25}>25 {t('app.transactions.rows')}</option>
                    <option value={50}>50 {t('app.transactions.rows')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-cc-forest hover:bg-cc-mint hover:border-cc-lime disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> {t('app.transactions.prev')}
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => {
                      const prevP = arr[idx - 1];
                      const showEllipsis = prevP && p - prevP > 1;

                      return (
                        <div key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="text-xs text-cc-muted px-1">...</span>}
                          <button
                            type="button"
                            onClick={() => setPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-extrabold transition flex items-center justify-center ${
                              page === p
                                ? 'bg-cc-forest text-white shadow-sm ring-2 ring-cc-lime/30'
                                : 'bg-white border border-gray-200 text-cc-muted hover:bg-gray-100 hover:text-cc-forest'
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-cc-forest hover:bg-cc-mint hover:border-cc-lime disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-sm"
                >
                  {t('app.transactions.next')} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>


      </div>

      {/* CSV Import Modal */}
      {showCsvForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className={`bg-white rounded-2xl shadow-2xl p-6 relative w-full transition-all duration-300 max-h-[90vh] flex flex-col ${!csvPreview ? 'max-w-xl' : 'max-w-4xl'}`}>
            <button type="button" className="absolute right-4 top-4 p-1 text-cc-muted hover:text-red-500 rounded-full hover:bg-red-50 transition" onClick={() => setShowCsvForm(false)}>
              <X className="w-5 h-5" />
            </button>
          <h2 className="font-bold text-cc-forest mb-4">{t('app.transactions.importCsvTitle')}</h2>
          
          {!csvPreview ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8">
              <UploadCloud className="w-8 h-8 text-cc-muted mb-2" />
              <p className="text-sm text-cc-muted mb-4">{t('app.transactions.selectCsv')}</p>
              <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="cursor-pointer bg-cc-forest text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90">
                {csvUploading ? t('app.transactions.parsing') : t('app.transactions.browseFile')}
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-cc-forest">{t('app.transactions.reviewConfirm', { count: csvPreview.length })}</p>
              <div className="max-h-[500px] overflow-y-auto border border-gray-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-cc-mint-soft sticky top-0 shadow-sm">
                    <tr className="text-left text-xs text-cc-muted">
                      <th className="px-3 py-2 font-semibold">{t('app.transactions.date')}</th>
                      <th className="px-3 py-2 font-semibold">{t('app.transactions.description')}</th>
                      <th className="px-3 py-2 font-semibold">{t('app.transactions.amount')}</th>
                      <th className="px-3 py-2 font-semibold">{t('app.transactions.type')}</th>
                      <th className="px-3 py-2 font-semibold">{t('app.transactions.category')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-3 py-2 text-cc-muted">
                          <input type="date" value={row.date?.slice(0,10) || ''} onChange={(e) => updateCsvRow(i, 'date', e.target.value)} className="w-full bg-transparent outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={row.description || ''} onChange={(e) => updateCsvRow(i, 'description', e.target.value)} className="w-full bg-transparent outline-none font-medium" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" step="0.01" value={row.amount || ''} onChange={(e) => updateCsvRow(i, 'amount', Number(e.target.value))} className="w-full bg-transparent outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <select value={row.type || 'expense'} onChange={(e) => updateCsvRow(i, 'type', e.target.value)} className="w-full bg-transparent outline-none text-xs">
                            <option value="expense">{t('app.transactions.expense')}</option>
                            <option value="income">{t('app.transactions.income')}</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 min-w-[160px]">
                          <CategorySelect
                            compact
                            categories={categories.filter((c) => c.type === (row.type || 'expense'))}
                            value={row.categoryId || row.aiSuggestedCategory || ''}
                            onChange={(id) => updateCsvRow(i, 'categoryId', id)}
                            placeholder={t('app.transactions.select')}
                            language={i18n.language}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setCsvPreview(null)} className="!rounded-xl bg-gray-100 !text-gray-600 hover:bg-gray-200">{t('app.transactions.cancel')}</Button>
                <Button onClick={confirmCsvImport} disabled={csvUploading} className="!rounded-xl">
                  {csvUploading ? t('app.transactions.importing') : t('app.transactions.confirmImport')}
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-sm">
            <button type="button" className="absolute right-4 top-4 p-1 text-cc-muted hover:text-red-500 rounded-full hover:bg-red-50 transition" onClick={() => setEditingTemplate(null)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-cc-forest mb-4">{t('app.transactions.editTemplate')}</h2>
            <form onSubmit={handleTemplateEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.templateName')}</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.type')}</label>
                <select
                  value={templateForm.type}
                  onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value, category: '' })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="expense">{t('app.transactions.expense')}</option>
                  <option value="income">{t('app.transactions.income')}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.category')}</label>
                <CategorySelect
                  required
                  categories={categories.filter((c) => c.type === templateForm.type)}
                  value={templateForm.category}
                  onChange={(id) => setTemplateForm({ ...templateForm, category: id })}
                  placeholder={t('app.transactions.select')}
                  language={i18n.language}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">
                  {t('app.transactions.amount')} ({profile?.currency || 'PKR'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={templateForm.amount}
                  onChange={(e) => setTemplateForm({ ...templateForm, amount: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full !rounded-xl">
                {submitting ? t('app.transactions.saving') : t('app.transactions.saveTemplate')}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Quick-Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <button type="button" className="absolute right-4 top-4 p-1 text-cc-muted hover:text-red-500 rounded-full hover:bg-red-50 transition" onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
          <h2 className="font-bold text-cc-forest mb-4">{editing ? t('app.transactions.editTitle') : t('app.transactions.quickAdd')} {t('app.transactions.transactionWord')}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.type')}</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value, categoryId: '' })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              >
                <option value="expense">{t('app.transactions.expense')}</option>
                <option value="income">{t('app.transactions.income')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">
                {t('app.transactions.amount')} ({profile?.currency || 'PKR'})
              </label>
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
              <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.description')}</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t('app.transactions.descriptionPlaceholder')}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
              {aiHint && aiHint.suggestedCategoryId && form.categoryId !== aiHint.suggestedCategoryId && (
                <button
                  type="button"
                  onClick={applyAi}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-cc-mint text-cc-forest px-3 py-1.5 rounded-full hover:bg-cc-lime hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('app.transactions.aiSuggests')}: {aiHint.categoryName || aiHint.name} — {t('app.transactions.apply')}
                </button>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.category')}</label>
              <CategorySelect
                required
                categories={typeCats}
                value={form.categoryId}
                onChange={(id) => setForm({ ...form, categoryId: id })}
                placeholder={t('app.transactions.select')}
                language={i18n.language}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">{t('app.transactions.date')}</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={submitting} className="!rounded-xl">
                {submitting ? t('app.transactions.saving') : editing ? t('app.transactions.saveChanges') : t('app.transactions.addTransaction')}
              </Button>
              {!editing && (
                <Button 
                  variant="outline"
                  type="button" 
                  disabled={submitting || !form.amount || !form.description || !form.categoryId} 
                  onClick={async () => {
                    setSubmitting(true);
                    try {
                      const res = await api.post('/api/templates', {
                        name: form.description,
                        category: form.categoryId,
                        type: form.type,
                        amount: Number(form.amount)
                      });
                      if (res.data.success) {
                        showToast('Saved as template!', 'success');
                        api.get('/api/templates').then(r => setTemplates(r.data.data));
                      }
                    } catch (err) {
                      showToast('Failed to save template', 'error');
                    }
                    setSubmitting(false);
                  }}
                  className="!rounded-xl"
                >
                  {t('app.transactions.saveAsTemplate')}
                </Button>
              )}
            </div>
          </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-sm">
            <button type="button" className="absolute right-4 top-4 p-1 text-cc-muted hover:text-red-500 rounded-full hover:bg-red-50 transition" onClick={() => setViewing(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-cc-forest mb-4">{t('app.transactions.transactionDetails')}</h2>
            {viewData ? (
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">{t('app.transactions.amount')}</span>
                  <span className={`font-bold ${viewData.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                    {viewData.type === 'income' ? '+' : '-'}{formatMoney(Number(viewData.amount), profile?.currency)}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">{t('app.transactions.description')}</span>
                  <span className="font-medium text-cc-ink text-right">{viewData.description}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">{t('app.transactions.category')}</span>
                  <span className="font-medium text-cc-ink text-right bg-cc-mint px-2 py-0.5 rounded-full text-xs">
                    {getCatName(viewData)}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">{t('app.transactions.date')}</span>
                  <span className="font-medium text-cc-ink text-right">
                    {viewData.date ? new Date(viewData.date).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cc-muted text-sm font-semibold">{t('app.transactions.type')}</span>
                  <span className="font-medium text-cc-ink text-right">{t(`app.transactions.${viewData.type}`)}</span>
                </div>
                {viewData.isFlagged && (
                  <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{viewData.flagReason || t('app.transactions.flagged')}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-cc-muted text-sm py-8">{t('app.transactions.loadingDetails')}</p>
            )}
          </div>
        </div>
      )}

    </>
  );
}
