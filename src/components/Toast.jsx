import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Toast() {
  const { toast, showToast } = useApp();
  if (!toast) return null;

  const type = toast.type || 'success';
  const dismiss = () => showToast(null);

  const styles = {
    success: {
      wrap: 'bg-white border-emerald-200 shadow-emerald-100/70',
      bar: 'bg-emerald-500',
      iconWrap: 'bg-emerald-100 text-emerald-600',
      title: 'Success',
      text: 'text-emerald-950',
      Icon: CheckCircle2,
    },
    error: {
      wrap: 'bg-white border-red-200 shadow-red-100/70',
      bar: 'bg-red-500',
      iconWrap: 'bg-red-100 text-red-600',
      title: 'Oops',
      text: 'text-red-950',
      Icon: AlertTriangle,
    },
    info: {
      wrap: 'bg-white border-sky-200 shadow-sky-100/70',
      bar: 'bg-sky-500',
      iconWrap: 'bg-sky-100 text-sky-600',
      title: 'Note',
      text: 'text-sky-950',
      Icon: Info,
    },
    warning: {
      wrap: 'bg-white border-amber-200 shadow-amber-100/70',
      bar: 'bg-amber-500',
      iconWrap: 'bg-amber-100 text-amber-600',
      title: 'Heads up',
      text: 'text-amber-950',
      Icon: AlertTriangle,
    },
  };

  const s = styles[type] || styles.info;
  const Icon = s.Icon;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`fixed bottom-6 right-6 z-[200] animate-fade-in w-[min(92vw,380px)] overflow-hidden rounded-2xl border shadow-2xl ${s.wrap}`}
    >
      <div className={`h-1.5 w-full ${s.bar}`} />
      <div className="flex gap-3 items-start p-4">
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${s.iconWrap}`}>
          <Icon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-xs font-bold uppercase tracking-wide opacity-70 ${s.text}`}>{s.title}</p>
          <p className={`mt-0.5 text-sm font-medium leading-relaxed ${s.text}`}>{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
