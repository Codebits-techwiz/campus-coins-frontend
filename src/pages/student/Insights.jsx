import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translateDynamicText } from '../../utils/translateDynamicText';
import { Pin, X, Bot, Bookmark, Loader2, Info, History } from 'lucide-react';
import api from '../../api';
import { useApp } from '../../context/AppContext';
import { formatMoney, toYearMonthLocal } from '../../utils/formatMoney';
import { getTipImpact } from '../../utils/tipImpact';

function formatInsightMonth(monthVal) {
  if (!monthVal) return '';
  const str = typeof monthVal === 'string' ? monthVal.slice(0, 7) : toYearMonthLocal(monthVal);
  const [y, m] = str.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default function Insights() {
  const { t, i18n } = useTranslation();
  const { showToast, profile } = useApp();
  const [insight, setInsight] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [tips, setTips] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const refreshHistory = useCallback(async () => {
    try {
      const res = await api.get('/api/ai/monthly-insights/history');
      if (res.data.success) setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch insight history', err);
    }
  }, []);

  const loadInsightForMonth = useCallback(async (month) => {
    setLoadingInsights(true);
    try {
      const url = month
        ? `/api/ai/monthly-insights?month=${month}`
        : '/api/ai/monthly-insights';
      const res = await api.get(url);
      if (res.data.success) {
        setInsight(res.data.data);
        const m = res.data.data?.month
          ? (typeof res.data.data.month === 'string'
              ? res.data.data.month.slice(0, 7)
              : toYearMonthLocal(new Date(res.data.data.month)))
          : month || '';
        if (m) setSelectedMonth(m);
        await refreshHistory();
      } else {
        setInsight(null);
      }
    } catch (err) {
      console.error('Failed to fetch insights', err);
      setInsight(null);
    }
    setLoadingInsights(false);
  }, [refreshHistory]);

  useEffect(() => {
    loadInsightForMonth('');

    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/ai/monthly-insights/history');
        if (res.data.success) setHistory(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch insight history', err);
      }
      setLoadingHistory(false);
    };

    const fetchTips = async () => {
      try {
        const res = await api.get('/api/ai/saving-tips');
        if (res.data.success) setTips(res.data.data);
      } catch (err) {
        console.error('Failed to fetch tips', err);
      }
      setLoadingTips(false);
    };

    const fetchForecast = async () => {
      try {
        const res = await api.get('/api/ai/forecast');
        if (res.data.success) setForecast(res.data.data);
      } catch (err) {
        console.error('Failed to fetch forecast', err);
      }
      setLoadingForecast(false);
    };

    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/api/bookmarks');
        if (res.data.success) {
          const ids = new Set(res.data.data.map((b) => b.refId));
          setBookmarkedIds(ids);
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks', err);
      }
    };

    fetchHistory();
    fetchTips();
    fetchForecast();
    fetchBookmarks();
  }, [loadInsightForMonth]);

  const handleToggleTipPin = async (tipId) => {

    setTips(tips.map(t => t._id === tipId ? { ...t, isPinned: !t.isPinned } : t));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/pin`);
    } catch (err) {
      showToast(t('app.insights.pinFailed'), 'error');

      setTips(tips.map(t => t._id === tipId ? { ...t, isPinned: !t.isPinned } : t));
    }
  };

  const handleBookmarkInsight = async (insightId) => {
    if (bookmarkedIds.has(insightId)) {
      showToast(t('app.insights.bookmarkExists'), 'info');
      return;
    }
    try {
      const res = await api.post('/api/bookmarks', { refType: 'insight', refId: insightId, note: t('app.insights.bookmarkNote') });
      if (res.data.success) {
        setBookmarkedIds((prev) => new Set([...prev, insightId]));
        showToast(t('app.insights.bookmarkSuccess'), 'success');
      }
    } catch (err) {
      if (err.response?.status === 409) {
         setBookmarkedIds((prev) => new Set([...prev, insightId]));
         showToast(t('app.insights.bookmarkExists'), 'info');
      } else {
         showToast(t('app.insights.bookmarkFailed'), 'error');
      }
    }
  };

  const handleBookmarkTip = async (tipId) => {
    if (bookmarkedIds.has(tipId)) {
      showToast(t('app.insights.tipBookmarkExists'), 'info');
      return;
    }
    try {
      const res = await api.post('/api/bookmarks', {
        refType: 'tip',
        refId: tipId,
        note: t('app.insights.tipBookmarkNote'),
      });
      if (res.data.success) {
        setBookmarkedIds((prev) => new Set([...prev, tipId]));
        showToast(t('app.insights.tipBookmarkSuccess'), 'success');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setBookmarkedIds((prev) => new Set([...prev, tipId]));
        showToast(t('app.insights.tipBookmarkExists'), 'info');
      } else {
        showToast(t('app.insights.tipBookmarkFailed'), 'error');
      }
    }
  };

  const handleDismissTip = async (tipId) => {

    const previous = [...tips];
    setTips(tips.filter(t => t._id !== tipId));
    try {
      await api.post(`/api/ai/saving-tips/${tipId}/dismiss`);
    } catch (err) {
      showToast(t('app.insights.dismissFailed'), 'error');

      setTips(previous);
    }
  };

  const activeTips = tips.filter(t => !t.dismissed);

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest flex items-center gap-2">
          <Bot className="w-7 h-7 text-cc-lime" /> {t('app.insights.title')}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl w-fit text-xs font-medium">
          <Info className="w-3.5 h-3.5" />
          {t('app.insights.disclaimerBanner')}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-cc-forest">{t('app.insights.monthlyInsight')}</h2>
          {history.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                loadInsightForMonth(e.target.value);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white min-w-[180px]"
            >
              {history.map((h) => {
                const m = typeof h.month === 'string'
                  ? h.month.slice(0, 7)
                  : toYearMonthLocal(new Date(h.month));
                return (
                  <option key={h._id || m} value={m}>
                    {formatInsightMonth(m)}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        {loadingInsights ? (
           <div className="flex items-center justify-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-cc-lime" />
           </div>
        ) : insight ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold uppercase text-cc-lime tracking-wide">
                  {selectedMonth ? formatInsightMonth(selectedMonth) : t('app.insights.currentSummary')}
                </span>
                <p className="text-[11px] text-cc-muted mt-0.5">
                  {insight.source === 'gemini' || insight.source === 'llm' ? t('app.insights.sourceGemini') : t('app.insights.sourceTemplate')}
                </p>
              </div>
              <button
                type="button"
                className={`p-2 rounded-lg transition ${
                  bookmarkedIds.has(insight._id)
                    ? 'text-cc-lime bg-cc-mint'
                    : 'text-cc-muted hover:bg-gray-50 hover:text-cc-lime'
                }`}
                title={bookmarkedIds.has(insight._id) ? t('app.insights.alreadyBookmarked') : t('app.insights.saveToBookmarks')}
                onClick={() => handleBookmarkInsight(insight._id)}
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(insight._id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-cc-ink leading-relaxed mb-3">{translateDynamicText(insight.summaryText || insight.text, i18n.language)}</p>
            <p className="text-[11px] text-cc-muted italic border-t border-gray-100 pt-2">
              {insight.disclaimer || t('app.insights.disclaimer')}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-cc-muted">
            {t('app.insights.noInsightData')}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-cc-forest flex items-center gap-2">
          <History className="w-5 h-5 text-cc-lime" /> {t('app.insights.historyTitle')}
        </h2>
        <p className="text-xs text-cc-muted -mt-2">{t('app.insights.historySubtitle')}</p>
        {loadingHistory ? (
          <div className="flex items-center justify-center py-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin text-cc-lime" />
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-cc-muted">
            {t('app.insights.noHistory')}
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((h) => {
              const m = typeof h.month === 'string'
                ? h.month.slice(0, 7)
                : toYearMonthLocal(new Date(h.month));
              const active = selectedMonth === m;
              return (
                <button
                  key={h._id || m}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(m);
                    loadInsightForMonth(m);
                  }}
                  className={`w-full text-left bg-white rounded-xl border p-4 transition ${
                    active
                      ? 'border-cc-lime ring-2 ring-cc-lime/20'
                      : 'border-gray-100 hover:border-cc-mint hover:bg-cc-mint-soft/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-cc-forest">{formatInsightMonth(m)}</span>
                    <span className="text-[10px] font-bold uppercase text-cc-muted">
                      {h.source === 'gemini' || h.source === 'llm' ? 'AI' : 'Template'}
                    </span>
                  </div>
                  <p className="text-xs text-cc-muted line-clamp-2">
                    {translateDynamicText(h.summaryText || h.text || '', i18n.language)}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-cc-forest">{t('app.insights.title')}</h2>
        <p className="text-xs text-cc-muted -mt-2">{t('app.insights.subtitle')}</p>

        {loadingTips ? (
           <div className="flex items-center justify-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-cc-lime" />
           </div>
        ) : activeTips.length > 0 ? (
          activeTips.map((tip) => (
            <div key={tip._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-3 items-start">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cc-mint text-cc-lime-dark">
                  {t('app.insights.impact')}: {translateDynamicText(getTipImpact(tip), i18n.language)}
                </span>
                <p className="text-sm text-cc-ink mt-2">{translateDynamicText(tip.text, i18n.language)}</p>
                <p className="text-[11px] text-cc-muted italic mt-2">
                  {t('app.insights.tipDisclaimer')}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleBookmarkTip(tip._id)}
                  className={`p-2 rounded-lg ${bookmarkedIds.has(tip._id) ? 'bg-cc-mint text-cc-lime' : 'text-cc-muted hover:bg-gray-50'}`}
                  title={bookmarkedIds.has(tip._id) ? t('app.insights.alreadyBookmarked') : t('app.insights.saveToBookmarks')}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(tip._id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTipPin(tip._id)}
                  className={`p-2 rounded-lg ${tip.isPinned ? 'bg-cc-mint text-cc-lime' : 'text-cc-muted hover:bg-gray-50'}`}
                  title={tip.isPinned ? t('app.dashboard.unpinTip') : t('app.dashboard.pinTip')}
                >
                  <Pin className={`w-4 h-4 ${tip.isPinned ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDismissTip(tip._id)}
                  className="p-2 rounded-lg text-cc-muted hover:bg-red-50 hover:text-red-500"
                  title={t('app.dashboard.dismissTip')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-cc-muted text-center py-8 bg-white rounded-2xl border border-dashed">
            {t('app.insights.noTips')}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-cc-forest">{t('app.insights.forecastTitle')}</h2>
        <p className="text-xs text-cc-muted -mt-2">{t('app.insights.forecastSubtitle')}</p>
        
        {loadingForecast ? (
           <div className="flex items-center justify-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-cc-lime" />
           </div>
        ) : forecast ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-cc-lime tracking-wide">
                {forecast.forecastMonth} {t('app.insights.projection')}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">
                {t('app.insights.confidence')}: {forecast.confidence}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs font-semibold text-cc-muted uppercase mb-1">{t('app.insights.expectedIncome')}</p>
                <p className="text-lg font-bold text-green-600">{formatMoney(Number(forecast.projections?.income), profile?.currency)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-cc-muted uppercase mb-1">{t('app.insights.expectedExpense')}</p>
                <p className="text-lg font-bold text-red-600">{formatMoney(Number(forecast.projections?.expense), profile?.currency)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-cc-muted uppercase mb-1">{t('app.insights.netSavings')}</p>
                <p className={`text-lg font-bold ${forecast.projections?.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatMoney(Number(forecast.projections?.netSavings), profile?.currency)}
                </p>
              </div>
            </div>
            
            <p className="text-[11px] text-cc-muted mt-4 text-center">
              {t('app.insights.basedOnMonths', { count: forecast.historicalDataPoints })}
            </p>
          </div>
        ) : (
          <p className="text-sm text-cc-muted text-center py-8 bg-white rounded-2xl border border-dashed">
            {t('app.insights.noForecast')}
          </p>
        )}
      </section>
    </div>
  );
}
