import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../../components/PageHero';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow={isUr ? 'قانونی اور سیکیورٹی' : 'Legal & Security'}
        title={isUr ? 'پرائیویسی پالیسی اور شرائط' : 'Privacy Policy & Terms'}
        subtitle={isUr ? 'طلبہ کے لیے بینک سے پاک، محفوظ اور شفاف فنانشل ٹریکنگ۔ آپ کی پرائیویسی ہماری اول ترجیح ہے۔' : 'Transparent, bank-free financial tracking tailored for students. Your data privacy is our highest priority.'}
      />

      <section className="py-16 bg-cc-mint-soft/30 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 sm:p-12 space-y-8">
            
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base mb-1">{isUr ? 'طلبہ کے ڈیٹا کی تحفظ کا وعدہ' : 'Our Student Data Commitment'}</h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {isUr
                    ? 'کیمپس کوائن کسی بینک اے پی آئی سے نہیں جڑتا اور نہ ہی کریڈٹ کارڈ کی تفصیلات مانگتا ہے۔ تمام ریکارڈز آپ خود پی کے آر میں درج کرتے ہیں اور آپ کے پورٹل کے لیے انکرپٹ رہتے ہیں۔'
                    : 'Campus Coin does not connect to bank APIs or require credit card details. All financial records are manually entered in PKR by you and encrypted for your private dashboard access.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cc-forest dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cc-lime" />
                {isUr ? '۱. جو معلومات ہم جمع کرتے ہیں' : '1. Data We Collect'}
              </h2>
              <p className="text-sm text-cc-muted dark:text-gray-300 leading-relaxed">
                {isUr
                  ? 'ہم صرف اکاؤنٹ پروفائل ڈیٹا (نام، ای میل، تعلیمی سال، ماہانہ الاؤنس) اور آپ کے درج کردہ اخراجات کا ریکارڈ محفوظ کرتے ہیں۔'
                  : 'We only collect basic account profile data (Name, Email, Academic Year, Monthly Allowance) and expense/income logs you intentionally record.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-xs text-cc-forest dark:text-cc-lime block mb-1">{isUr ? 'محفوظ کردہ معلومات' : 'Collected Data'}</span>
                  <ul className="text-xs text-cc-muted dark:text-gray-300 space-y-1">
                    <li>• {isUr ? 'اکاؤنٹ لاگ اِن (انکرپٹڈ پاس ورڈ)' : 'Account credentials (encrypted password)'}</li>
                    <li>• {isUr ? 'دستی ٹرانزیکشنز (پی کے آر میں)' : 'Manual transaction amounts (in PKR)'}</li>
                    <li>• {isUr ? 'کیٹیگری ٹیگز اور بجٹ حدود' : 'Selected category tags & custom budget limits'}</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-xs font-mono text-red-500 block mb-1">{isUr ? 'کبھی جمع نہیں کی جاتی' : 'NEVER Collected'}</span>
                  <ul className="text-xs text-cc-muted dark:text-gray-300 space-y-1">
                    <li>• {isUr ? 'بینک اکاؤنٹ نمبر یا پاس ورڈ' : 'Bank account numbers or passwords'}</li>
                    <li>• {isUr ? 'کریڈٹ کارڈ یا سی وی وی' : 'Credit card details or CVVs'}</li>
                    <li>• {isUr ? 'شناختی کارڈ یا بائیو میٹرکس' : 'CNIC, National IDs or biometrics'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cc-forest dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cc-lime" />
                {isUr ? '۲. اے آئی اسسٹنٹ اور ڈیٹا کا استعمال' : '2. AI Assistant & Data Usage'}
              </h2>
              <p className="text-sm text-cc-muted dark:text-gray-300 leading-relaxed">
                {isUr
                  ? 'ہماری اے آئی کیٹیگری تجویز کرنے کے لیے ٹرانزیکشن کی تفصیلات دیکھتی ہے تاکہ "کھانا اور کینٹین" جیسے ٹیگز دکھائے جا سکیں۔ آپ کا ڈیٹا پبلک اے آئی کو ٹرین کرنے کے لیے استعمال نہیں ہوتا۔'
                  : 'Our smart category suggestor processes transaction descriptions in memory to recommend categories like "Food & Canteen" or "Hostel Rent". Your personal descriptions are never used to train third-party public AI models.'}
              </p>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cc-forest dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cc-lime" />
                {isUr ? '۳. سیکیورٹی اور ذخیرہ' : '3. Security & Storage'}
              </h2>
              <p className="text-sm text-cc-muted dark:text-gray-300 leading-relaxed">
                {isUr
                  ? 'ہم جدید JWT ااتھنٹیکیشن اور پاس ورڈ ہیشنگ استعمال کرتے ہیں۔ تمام اے پی آئی کالز SSL/TLS انکرپٹڈ ہیں۔'
                  : 'We employ industry-standard JWT authentication with salt-hashed passwords. All API calls are protected over TLS encryption to guarantee data integrity.'}
              </p>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cc-forest dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cc-lime" />
                {isUr ? '۴. استعمال کی شرائط اور گارانٹی' : '4. Terms of Usage & Student Guarantee'}
              </h2>
              <p className="text-sm text-cc-muted dark:text-gray-300 leading-relaxed">
                {isUr
                  ? 'کیمپس کوائن اکاؤنٹ بنا کر آپ تصدیق کے لیے درست ای میل فراہم کرنے سے اتفاق کرتے ہیں۔ آپ کا ڈیٹا آپ کی ملکیت ہے اور کسی بھی وقت حذف کیا جا سکتا ہے۔'
                  : 'By creating a Campus Coin account, you agree to provide accurate email details for verification. You retain full ownership of your data and can request deletion anytime.'}
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
