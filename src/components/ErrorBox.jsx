import { AlertTriangle, X, Info, CheckCircle2 } from 'lucide-react';
import { getFriendlyError } from '../utils/friendlyError';

/**
 * Beautiful, readable status box for non-technical users.
 * variant: 'error' | 'warning' | 'info' | 'success'
 */
export function ErrorBox({
  message,
  title,
  variant = 'error',
  onClose,
  className = '',
  children,
}) {
  if (!message && !children) return null;

  const text =
    typeof message === 'string' || message == null
      ? message
      : getFriendlyError(message);

  const styles = {
    error: {
      wrap: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-900 shadow-red-100/80',
      iconWrap: 'bg-red-100 text-red-600',
      title: 'text-red-950',
      body: 'text-red-800/90',
      close: 'text-red-400 hover:text-red-700 hover:bg-red-100',
      Icon: AlertTriangle,
      defaultTitle: 'Something needs your attention',
    },
    warning: {
      wrap: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-950 shadow-amber-100/80',
      iconWrap: 'bg-amber-100 text-amber-600',
      title: 'text-amber-950',
      body: 'text-amber-900/90',
      close: 'text-amber-400 hover:text-amber-700 hover:bg-amber-100',
      Icon: AlertTriangle,
      defaultTitle: 'Just a heads-up',
    },
    info: {
      wrap: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 text-sky-950 shadow-sky-100/80',
      iconWrap: 'bg-sky-100 text-sky-600',
      title: 'text-sky-950',
      body: 'text-sky-900/90',
      close: 'text-sky-400 hover:text-sky-700 hover:bg-sky-100',
      Icon: Info,
      defaultTitle: 'Good to know',
    },
    success: {
      wrap: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-950 shadow-emerald-100/80',
      iconWrap: 'bg-emerald-100 text-emerald-600',
      title: 'text-emerald-950',
      body: 'text-emerald-900/90',
      close: 'text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100',
      Icon: CheckCircle2,
      defaultTitle: 'All set',
    },
  };

  const s = styles[variant] || styles.error;
  const Icon = s.Icon;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`relative flex gap-3 items-start p-4 rounded-2xl border shadow-md ${s.wrap} ${className}`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${s.iconWrap}`}>
        <Icon className="w-5 h-5" strokeWidth={2.25} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className={`text-sm font-bold leading-snug ${s.title}`}>
          {title || s.defaultTitle}
        </p>
        {text && (
          <p className={`mt-1 text-sm leading-relaxed ${s.body}`}>{text}</p>
        )}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className={`shrink-0 p-1.5 rounded-lg transition ${s.close}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
