import { useState, useEffect } from 'react';
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
import { formatPkr } from '../../utils/currency';
import { translateDynamicText } from '../../utils/translateDynamicText';

const COLORS = ['#5CB85C', '#0B3D2E', '#F5C518', '#3D9B3D', '#95cea4', '#145A43', '#62b375'];

export default function Reports() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';
  const { showToast, profile } = useApp();

  const [range, setRange] = useState('2026-09');
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [trend6Months, setTrend6Months] = useState([]);
  const [dailyWeekly, setDailyWeekly] = useState({ dailyAverage: 0, weeklyAverage: 0 });
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [catRes, trendRes, dwRes] = await Promise.all([
          api.get(`/api/reports/category-breakdown?month=${range}`),
          api.get(`/api/reports/trend-6months?month=${range}`),
          api.get(`/api/reports/daily-weekly?month=${range}`)
        ]);
        if (catRes.data.success && catRes.data.data) {
          const catArray = Array.isArray(catRes.data.data) ? catRes.data.data : (catRes.data.data.categories || []);
          setCategoryBreakdown(catArray.map(d => ({ name: translateDynamicText(d.name || d.categoryId, i18n.language), value: d.total })));
        }
        if (trendRes.data.success && Array.isArray(trendRes.data.data)) {
          setTrend6Months(trendRes.data.data.map(d => ({ month: d.month || d._id, income: d.income, expense: d.expense })));
        }
        if (dwRes.data.success && dwRes.data.data) {
          const dailyExpenses = dwRes.data.data.daily?.filter(d => d.type === 'expense').map(d => d.total) || [];
          const weeklyExpenses = dwRes.data.data.weekly?.filter(w => w.type === 'expense').map(w => w.total) || [];
          
          const dAvg = dailyExpenses.length ? dailyExpenses.reduce((a, b) => a + b, 0) / dailyExpenses.length : 0;
          const wAvg = weeklyExpenses.length ? weeklyExpenses.reduce((a, b) => a + b, 0) / weeklyExpenses.length : 0;
          
          setDailyWeekly({ dailyAverage: dAvg, weeklyAverage: wAvg });
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
      setLoading(false);
    };

    fetchReports();
  }, [range, i18n.language]);

  const handleExportPdf = async () => {
    try {
      showToast(isUr ? 'پی ڈی ایف بن رہی ہے...' : 'Generating PDF...', 'success');
      const res = await api.get(`/api/reports/export-pdf?month=${range}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campus-coin-report-${range}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('Failed to export PDF', 'error');
    }
  };

  const handleShareEmail = async () => {
    const email = prompt(isUr ? "والدین کا ای میل ایڈریس درج کریں:" : "Enter parent's email address:");
    if (!email) return;
    setSharing(true);
    try {
      const res = await api.post('/api/reports/share-email', { recipientEmail: email, month: range });
      if (res.data.success) showToast(isUr ? 'ای میل کامیابی سے بھیج دی گئی' : 'Email sent successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send email', 'error');
    }
    setSharing(false);
  };

  const handleExportImage = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) return;

    showToast(isUr ? 'تصویر تیار ہو رہی ہے...' : 'Generating Image...', 'info');
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
      link.download = `campus-coin-report-${range}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Report image downloaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to export image:', error);
      showToast('Failed to export Image', 'error');
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cc-forest">{t('app.reports.title')}</h1>
          <p className="text-sm text-cc-muted">{t('app.reports.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleExportPdf}
          >
            <Download className="w-4 h-4" /> {isUr ? 'پی ڈی ایف ایکسپورٹ' : 'Export PDF'}
          </Button>
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleExportImage}
          >
            <ImageIcon className="w-4 h-4" /> {isUr ? 'تصویر ایکسپورٹ' : 'Export Image'}
          </Button>
          <Button
            variant="outline"
            className="!rounded-xl !text-sm"
            onClick={handleShareEmail}
            disabled={sharing}
          >
            <Mail className="w-4 h-4" /> {isUr ? 'ای میل سے شیئر کریں' : 'Share Email'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="2026-09">{isUr ? 'ستمبر ۲۰۲۶' : 'September 2026'}</option>
          <option value="2026-08">{isUr ? 'اگست ۲۰۲۶' : 'August 2026'}</option>
          <option value="2026-07">{isUr ? 'جولائی ۲۰۲۶' : 'July 2026'}</option>
        </select>
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
                      <Tooltip formatter={(value) => formatPkr(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">{t('app.dashboard.noTransactions')}</div>
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
                      <Tooltip formatter={(value) => formatPkr(value)} />
                      <Bar dataKey="income" fill="#5CB85C" name={t('app.dashboard.income')} />
                      <Bar dataKey="expense" fill="#0B3D2E" name={t('app.dashboard.expenses')} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-cc-muted">{t('app.dashboard.noTransactions')}</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-cc-forest mb-4">{isUr ? 'اوسط خرچ' : 'Averages'}</h2>
            <div className="flex gap-10">
               <div>
                  <p className="text-xs text-cc-muted uppercase font-bold mb-1">{isUr ? 'روزانہ اوسط خرچ' : 'Daily Average Spending'}</p>
                  <p className="text-2xl font-extrabold text-cc-ink">{formatPkr(dailyWeekly.dailyAverage)}</p>
               </div>
               <div>
                  <p className="text-xs text-cc-muted uppercase font-bold mb-1">{isUr ? 'ہفتہ وار اوسط خرچ' : 'Weekly Average Spending'}</p>
                  <p className="text-2xl font-extrabold text-cc-ink">{formatPkr(dailyWeekly.weeklyAverage)}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
