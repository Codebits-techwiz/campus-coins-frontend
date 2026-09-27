import { ShieldCheck, X, FileText, Lock, Eye, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export function PrivacyModal({ isOpen, onClose, onAccept }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-cc-mint-soft/30 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cc-lime/15 text-cc-forest dark:text-cc-lime">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cc-forest dark:text-white">
                Privacy Policy & Terms of Service
              </h2>
              <p className="text-xs text-cc-muted dark:text-gray-400">
                How Campus Coin protects your data & privacy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-cc-muted dark:text-gray-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">100% Student Privacy Promise</strong>
              Campus Coin never connects to your bank account, never sells your personal data, and keeps your budget logs encrypted and secure in PKR.
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-cc-forest dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cc-lime" />
              1. Information We Collect
            </h3>
            <p>
              We collect minimal information necessary to deliver smart financial tracking for students:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Account Info:</strong> Name, campus email address, academic year, and monthly allowance.</li>
              <li><strong>Financial Logs:</strong> Expense categories, income entries, and budget targets entered manually in PKR.</li>
              <li><strong>Usage Analytics:</strong> Anonymous feature interactions to improve AI spending recommendations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-cc-forest dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cc-lime" />
              2. How We Use Your Data
            </h3>
            <p>
              Your data is strictly used to render visual expense reports, trigger budget alert thresholds, and power AI recommendations personalized to your spending habits.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-cc-forest dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cc-lime" />
              3. Data Protection & Bank-Free Architecture
            </h3>
            <p>
              Unlike traditional fintech tools, Campus Coin requires <strong>zero bank account credentials or credit card links</strong>. You have 100% control over what transactions you record.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-cc-forest dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cc-lime" />
              4. User Rights & Account Deletion
            </h3>
            <p>
              You can export your budget logs, update your details, or permanently delete your account and data at any time from your Profile settings.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/40">
          <p className="text-xs text-cc-muted dark:text-gray-400">
            Last updated: September 2026
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-cc-forest dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Close
            </button>
            {onAccept && (
              <Button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="flex-1 sm:flex-initial !rounded-xl !py-2.5 !px-5 text-xs"
              >
                I Accept Terms & Policy
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
