import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Image as ImageIcon, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { formatMoney } from '../../utils/formatMoney';
import { translateDynamicText } from '../../utils/translateDynamicText';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43', '#62b375'];

function buildMonthOptions(count = 12) {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    opts.push({ value, label });
  }
  return opts;
}

export default function Reports() {
  const { t, i18n } = useTranslation();
  const { showToast, categories, profile } = useApp();

  const monthOptions = useMemo(() => buildMonthOptions(12), []);
  const [month, setMonth] = useState(monthOptions[0]?.value || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('expense');
  const [categoryId, setCategoryId] = useState('');

  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [trend6Months, setTrend6Months] = useState([]);
  const [dailyWeekly, setDailyWeekly] = useState({ dailyAverage: 0, weeklyAverage: 0 });
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const filteredCategories = useMemo(() => {
    if (typeFilter === 'all') return categories || [];
    return (categories || []).filter((c) => c.type === typeFilter);
  }, [categories, typeFilter]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (dateFrom || dateTo) {
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
    } else if (month) {
      params.set('month', month);
    }
    if (typeFilter) params.set('type', typeFilter);
    if (categoryId) params.set('category', categoryId);
    return params.toString();
  }, [month, dateFrom, dateTo, typeFilter, categoryId]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [catRes, trendRes, dwRes] = await Promise.all([
          api.get(`/api/reports/category-breakdown?${queryParams}`),
          api.get('/api/reports/trend-6months'),
          api.get(`/api/reports/daily-weekly?${queryParams}`)
        ]);
        if (catRes.data.success && catRes.data.data) {
          const catArray = Array.isArray(catRes.data.data)
            ? catRes.data.data
            : (catRes.data.data.categories || []);
          setCategoryBreakdown(
            catArray.map((d) => ({
              name: translateDynamicText(d.name || d.categoryId, i18n.language),
              value: d.total
            }))
          );
        } else {
          setCategoryBreakdown([]);
        }
        if (trendRes.data.success && Array.isArray(trendRes.data.data)) {
          setTrend6Months(
            trendRes.data.data.map((d) => ({
              month: d.month || d._id,
              income: d.income,
              expense: d.expense
            }))
          );
        }
        if (dwRes.data.success && dwRes.data.data) {
          const typeMatch = (row) => typeFilter === 'all' || row.type === typeFilter || (!typeFilter && row.type === 'expense');
          const dailyRows = (dwRes.data.data.daily || []).filter(typeMatch);
          const weeklyRows = (dwRes.data.data.weekly || []).filter(typeMatch);

          const dAvg = dailyRows.length
            ? dailyRows.reduce((a, b) => a + b.total, 0) / dailyRows.length
            : 0;
          const wAvg = weeklyRows.length
            ? weeklyRows.reduce((a, b) => a + b.total, 0) / weeklyRows.length
            : 0;

          setDailyWeekly({ dailyAverage: dAvg, weeklyAverage: wAvg });
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
      setLoading(false);
    };

    fetchReports();
  }, [queryParams, i18n.language, typeFilter]);

  const exportMonth = month || new Date().toISOString().slice(0, 7);

  const handleExportPdf = async () => {
    try {
      showToast(t('app.reports.generatingPdf'), 'success');
      const qs = queryParams || `month=${exportMonth}`;
      const res = await api.get(`/api/reports/export-pdf?${qs}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campus-coin-report-${exportMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast(t('app.reports.pdfFailed'), 'error');
    }
  };

  const handleShareEmail = async () => {
    const email = prompt(t('app.reports.enterParentEmail'));
    if (!email) return;
    setSharing(true);
    try {
      const shareBody = {
        recipientEmail: email,
        type: typeFilter || 'expense',
      };
      if (dateFrom || dateTo) {
        if (dateFrom) shareBody.dateFrom = dateFrom;
        if (dateTo) shareBody.dateTo = dateTo;
      } else {
        shareBody.month = exportMonth;
      }
      if (categoryId) shareBody.category = categoryId;
      const res = await api.post('/api/reports/share-email', shareBody);
      if (res.data.success) showToast(t('app.reports.emailSent'), 'success');
    } catch (err) {
      showToast(err.response?.data?.error || t('app.reports.emailFailed'), 'error');
    }
    setSharing(false);
  };

  const handleExportImage = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) return;

    showToast(t('app.reports.generatingImage'), 'info');
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            if (tag.innerHTML && tag.innerHTML.includes('oklch')) {
              tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#0B3D2E');
            }
          });

          const container = clonedDoc.getElementById('report-container');
          if (container) {
            const elements = container.querySelectorAll('*');
            elements.forEach((node) => {
              if (node instanceof HTMLElement) {
                const style = node.style;
                ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach((prop) => {
                  if (style[prop] && style[prop].includes('oklch')) {
                    style[prop] = '#0B3D2E';
                  }
                });
              }
            });
          }
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `campus-coin-report-${exportMonth}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(t('app.reports.imageSuccess'), 'success');
    } catch (error) {
      console.error('Failed to export image:', error);
      showToast(t('app.reports.imageFailed'), 'error');
    }
  };

  const clearCustomDates = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">{t('app.reports.title')}</h1>
          <p className="text-sm text-cc-muted">{t('app.reports.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="!rounded-xl !text-sm" onClick={handleExportPdf}>
            <Download className="w-4 h-4" /> {t('app.reports.exportPdf')}
          </Button>
          <Button variant="outline" className="!rounded-xl !text-sm" onClick={handleExportImage}>
            <ImageIcon className="w-4 h-4" /> {t('app.reports.exportImage')}
          </Button>
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleShareEmail}
            disabled={sharing}
          >
            <Mail className="w-4 h-4" /> {t('app.reports.shareEmail')}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-cc-muted mb-3">{t('app.reports.filters')}</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-[11px] font-semibold text-cc-muted uppercase">{t('app.reports.month')}</label>
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                clearCustomDates();
              }}
              disabled={!!(dateFrom || dateTo)}
              className="mt-1 block px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white min-w-[160px] disabled:opacity-50"
            >
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-cc-muted uppercase">{t('app.reports.dateFrom')}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1 block px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-cc-muted uppercase">{t('app.reports.dateTo')}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1 block px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-cc-muted uppercase">{t('app.reports.typeFilter')}</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCategoryId('');
              }}
              className="mt-1 block px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white min-w-[140px]"
            >
              <option value="all">{t('app.transactions.all')}</option>
              <option value="expense">{t('app.transactions.expense')}</option>
              <option value="income">{t('app.transactions.income')}</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-cc-muted uppercase">
              {typeFilter === 'income' ? t('app.reports.incomeSource') : t('app.reports.category')}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 block px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white min-w-[180px]"
            >
              <option value="">{t('app.transactions.allCategories')}</option>
              {filteredCategories.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {translateDynamicText(c.name, i18n.language)}
                </option>
              ))}
            </select>
          </div>
          {(dateFrom || dateTo || categoryId || typeFilter !== 'expense') && (
            <button
              type="button"
              onClick={() => {
                clearCustomDates();
                setCategoryId('');
                setTypeFilter('expense');
                setMonth(monthOptions[0]?.value || '');
              }}
              className="px-3 py-2 text-xs font-bold text-cc-forest border border-gray-200 rounded-xl hover:bg-cc-mint"
            >
              {t('app.reports.clearFilters')}
            </button>
          )}
        </div>
        {(dateFrom || dateTo) && (
          <p className="text-[11px] text-cc-muted mt-2">{t('app.reports.customRangeHint')}</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-cc-muted text-sm">{t('common.loading')}</div>
      ) : (
        <div id="report-container" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-cc-forest mb-4">{t('app.dashboard.categoryPie')}</h2>
              <div className="h-64">
                {categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                        {categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatMoney(value, profile?.currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">
                    {t('app.dashboard.noTransactions')}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-cc-forest mb-4">{t('app.dashboard.trendTitle')}</h2>
              <div className="h-64">
                {trend6Months.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend6Months}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatMoney(value, profile?.currency)} />
                      <Bar dataKey="income" fill="#5CB85C" name={t('app.dashboard.income')} />
                      <Bar dataKey="expense" fill="#0B3D2E" name={t('app.dashboard.expenses')} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">
                    {t('app.dashboard.noTransactions')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-cc-forest mb-4">{t('app.reports.averages')}</h2>
            <div className="flex gap-10">
              <div>
                <p className="text-xs text-cc-muted uppercase font-bold mb-1">{t('app.reports.dailyAvg')}</p>
                <p className="text-2xl font-extrabold text-cc-ink">{formatMoney(dailyWeekly.dailyAverage, profile?.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-cc-muted uppercase font-bold mb-1">{t('app.reports.weeklyAvg')}</p>
                <p className="text-2xl font-extrabold text-cc-ink">{formatMoney(dailyWeekly.weeklyAverage, profile?.currency)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
