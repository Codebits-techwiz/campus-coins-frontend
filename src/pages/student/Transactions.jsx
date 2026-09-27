import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Sparkles, X, Search, FileUp, UploadCloud, Camera, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatPkr } from '../../utils/currency';
import { formatMoney } from '../../utils/formatMoney';
import { CategoryIcon } from '../../utils/categoryIcons';

const empty = {
  type: 'expense',
  categoryId: '',
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
};

export default function Transactions() {
  const { t } = useTranslation();
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    showToast,
    profile,
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
  const [csvError, setCsvError] = useState('');

  const [ocrUploading, setOcrUploading] = useState(false);
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
      date: new Date().toISOString().slice(0, 10),
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
    setCsvError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/transactions/import-csv/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.data?.preview?.length > 0) {
        setCsvPreview(res.data.data.preview);
      } else {
        setCsvError('No valid rows found in CSV.');
      }
    } catch (err) {
      setCsvError(err.response?.data?.error || 'Failed to parse CSV');
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
        setCsvError('Please assign a category to all rows.');
        return;
      }
      row.categoryId = catId; // Set final category ID
    }
    
    setCsvUploading(true);
    setCsvError('');
    try {
      const res = await api.post('/api/transactions/import-csv/confirm', { rows: csvPreview });
      if (res.data.success) {
        window.location.reload(); // Reload to refresh transactions & stats
      }
    } catch (err) {
      setCsvError(err.response?.data?.error || 'Failed to import CSV');
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
                formattedDate = new Date(date).toISOString().slice(0, 10);
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
              <Camera className="w-4 h-4" /> {ocrUploading ? 'Scanning...' : 'Scan Receipt'}
            </label>
          </div>
          <Button variant="outline" onClick={() => { setShowCsvForm(true); setShowForm(false); setCsvPreview(null); setCsvFile(null); setCsvError(''); }} className="!rounded-xl border-2">
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
            <Sparkles className="w-3.5 h-3.5 text-cc-lime shrink-0" /> Quick Saved Templates (Click to Auto-fill)
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {templates.map((t) => (
              <div key={getId(t)} className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => useTemplate(t)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-cc-forest hover:border-cc-lime hover:bg-cc-mint-soft transition whitespace-nowrap pr-8"
                >
                  <CategoryIcon iconKey={t.category?.icon} color={t.category?.color} className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.name}</span>
                  <span className="text-cc-muted font-semibold">{formatPkr(Number(t.amount))}</span>
                </button>
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition bg-white/90 px-1 rounded-lg">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate(getId(t));
                      setTemplateForm({
                        name: t.name,
                        amount: String(t.amount),
                        type: t.type,
                        category: getCatId(t) || '',
                      });
                    }}
                    className="p-1 hover:bg-cc-mint hover:text-cc-forest rounded-md text-cc-muted transition"
                    title="Edit Template"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await api.delete(`/api/templates/${getId(t)}`);
                        setTemplates((prev) => prev.filter((x) => getId(x) !== getId(t)));
                        showToast('Template deleted', 'success');
                      } catch (err) {
                        showToast('Failed to delete template', 'error');
                      }
                    }}
                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded-md text-cc-muted transition"
                    title="Delete Template"
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
              className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition ${
                filter === f
                  ? 'bg-cc-forest text-white shadow-sm ring-2 ring-cc-lime/30'
                  : 'bg-gray-50 text-cc-muted hover:bg-gray-100 hover:text-cc-forest border border-gray-200/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description or category..."
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
          <div className="p-12 text-center space-y-2">
            <Search className="w-8 h-8 text-cc-muted mx-auto opacity-30" />
            <p className="text-sm font-bold text-cc-forest">
              {transactions.length === 0 ? 'No transactions logged yet.' : 'No matching transactions found.'}
            </p>
            <p className="text-xs text-cc-muted">
              {transactions.length === 0
                ? 'Click "+ Add Transaction" above to log your first income or expense.'
                : 'Try clearing your search query or changing filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cc-mint-soft border-b border-gray-100">
                  <tr className="text-left text-xs font-bold text-cc-forest uppercase tracking-wider">
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((t) => (
                    <tr key={getId(t)} className="hover:bg-cc-mint-soft/40 transition">
                      <td className="px-4 py-3.5 text-xs font-medium text-cc-muted whitespace-nowrap">
                        {t.date ? new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-cc-forest">{t.description}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: t.category?.color ? `${t.category.color}15` : '#f0fdf4',
                            color: t.category?.color || '#166534',
                          }}
                        >
                          <CategoryIcon iconKey={t.category?.icon} color={t.category?.color || '#166534'} className="w-3.5 h-3.5" />
                          {getCatName(t)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 capitalize text-xs font-bold text-cc-muted">{t.type}</td>
                      <td className={`px-4 py-3.5 text-right font-extrabold ${t.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatMoney(Number(t.amount), profile?.currency)}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openView(t)}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-cc-forest hover:bg-gray-100 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-cc-lime hover:bg-cc-mint transition"
                          title="Edit Transaction"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(getId(t))}
                          className="p-1.5 rounded-lg text-cc-muted hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Transaction"
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
                  Showing <strong className="text-cc-forest">{(page - 1) * itemsPerPage + 1}</strong> to{' '}
                  <strong className="text-cc-forest">{Math.min(page * itemsPerPage, filtered.length)}</strong> of{' '}
                  <strong className="text-cc-forest">{filtered.length}</strong> transactions
                </span>

                <div className="flex items-center gap-1.5 border-l border-gray-300 pl-3">
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-cc-forest outline-none focus:border-cc-lime cursor-pointer shadow-sm"
                  >
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
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
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
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
                  Next <ChevronRight className="w-3.5 h-3.5" />
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
          <h2 className="font-bold text-cc-forest mb-4">Import Transactions (CSV)</h2>
          
          {csvError && <div className="text-red-500 text-sm mb-4">{csvError}</div>}
          
          {!csvPreview ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8">
              <UploadCloud className="w-8 h-8 text-cc-muted mb-2" />
              <p className="text-sm text-cc-muted mb-4">Select a CSV file to preview and import.</p>
              <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="cursor-pointer bg-cc-forest text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90">
                {csvUploading ? 'Parsing...' : 'Browse File'}
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-cc-forest">Review & Confirm {csvPreview.length} rows:</p>
              <div className="max-h-[500px] overflow-y-auto border border-gray-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-cc-mint-soft sticky top-0 shadow-sm">
                    <tr className="text-left text-xs text-cc-muted">
                      <th className="px-3 py-2 font-semibold">Date</th>
                      <th className="px-3 py-2 font-semibold">Description</th>
                      <th className="px-3 py-2 font-semibold">Amount</th>
                      <th className="px-3 py-2 font-semibold">Type</th>
                      <th className="px-3 py-2 font-semibold">Category</th>
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
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select value={row.categoryId || row.aiSuggestedCategory || ''} onChange={(e) => updateCsvRow(i, 'categoryId', e.target.value)} className="w-full bg-transparent outline-none text-xs border rounded px-1 border-cc-mint text-cc-forest">
                            <option value="">Select...</option>
                            {categories.filter(c => c.type === (row.type || 'expense')).map(c => (
                              <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setCsvPreview(null)} className="!rounded-xl bg-gray-100 !text-gray-600 hover:bg-gray-200">Cancel</Button>
                <Button onClick={submitCsvConfirm} disabled={csvUploading} className="!rounded-xl">
                  {csvUploading ? 'Importing...' : 'Confirm Import'}
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
            <h2 className="font-bold text-cc-forest mb-4">Edit Template</h2>
            <form onSubmit={handleTemplateEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Template Name</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Type</label>
                <select
                  value={templateForm.type}
                  onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value, category: '' })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Category</label>
                <select
                  required
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
                >
                  <option value="">Select…</option>
                  {categories.filter(c => c.type === templateForm.type).map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-cc-muted uppercase">Amount ({profile?.currency || 'USD'})</label>
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
                {submitting ? 'Saving...' : 'Save Template'}
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
          <h2 className="font-bold text-cc-forest mb-4">{editing ? 'Edit' : 'Quick Add'} Transaction</h2>
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
              <label className="text-xs font-semibold text-cc-muted uppercase">Amount (PKR)</label>
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
                placeholder="e.g. Campus Cafe lunch"
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
              {aiHint && aiHint.suggestedCategoryId && form.categoryId !== aiHint.suggestedCategoryId && (
                <button
                  type="button"
                  onClick={applyAi}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-cc-mint text-cc-forest px-3 py-1.5 rounded-full hover:bg-cc-lime hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI suggests: {aiHint.categoryName || aiHint.name} — Apply
                </button>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Category</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
              >
                <option value="">Select...</option>
                {typeCats.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-cc-muted uppercase">Date</label>
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
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Transaction'}
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
                  Save as Template
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
            <h2 className="font-bold text-cc-forest mb-4">Transaction Details</h2>
            {viewData ? (
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">Amount</span>
                  <span className={`font-bold ${viewData.type === 'income' ? 'text-cc-lime' : 'text-red-500'}`}>
                    {viewData.type === 'income' ? '+' : '-'}{formatPkr(Number(viewData.amount))}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">Description</span>
                  <span className="font-medium text-cc-ink text-right">{viewData.description}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">Category</span>
                  <span className="font-medium text-cc-ink text-right bg-cc-mint px-2 py-0.5 rounded-full text-xs">
                    {getCatName(viewData)}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-cc-muted text-sm font-semibold">Date</span>
                  <span className="font-medium text-cc-ink text-right">
                    {viewData.date ? new Date(viewData.date).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cc-muted text-sm font-semibold">Type</span>
                  <span className="font-medium text-cc-ink text-right capitalize">{viewData.type}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-cc-muted text-sm py-8">Loading details...</p>
            )}
          </div>
        </div>
      )}

    </>
  );
}
