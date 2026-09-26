import { useState, useRef } from 'react';
import { Upload, Save, Moon, Sun, Type } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import api from '../../api';

export default function Profile() {
  const { profile, setProfile, importCsv, showToast, darkMode, setDarkMode, fontSize, setFontSize } = useApp();
  const [form, setForm] = useState({ 
    ...profile,
    monthlyAllowanceBaseline: profile?.monthlyAllowanceBaseline || 0,
    monthlySavingsGoal: profile?.monthlySavingsGoal || 0,
    currency: profile?.currency || 'PKR'
  });
  const fileRef = useRef(null);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        academicYear: form.academicYear,
        monthlyAllowanceBaseline: Number(form.monthlyAllowanceBaseline),
        monthlySavingsGoal: Number(form.monthlySavingsGoal),
        currency: form.currency
      };
      const res = await api.put('/api/users/profile', payload);
      if (res.data.success) {
        setProfile(res.data.data);
        showToast('Profile updated', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importCsv(12);
    e.target.value = '';
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-cc-forest">Profile & Settings</h1>
        <p className="text-sm text-cc-muted">Academic year, allowance baseline, savings goal, accessibility</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <img src={profile.avatar} alt="" className="w-16 h-16 rounded-full ring-4 ring-cc-mint object-cover" />
          <div>
            <p className="font-bold text-cc-forest">{profile.name}</p>
            <p className="text-xs text-cc-muted">{profile.email}</p>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cc-lime"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">Academic year</label>
          <select
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          >
            {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate'].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Monthly allowance ({form.currency})</label>
            <input
              type="number"
              value={form.monthlyAllowanceBaseline}
              onChange={(e) => setForm({ ...form, monthlyAllowanceBaseline: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cc-muted uppercase">Savings goal ({form.currency})</label>
            <input
              type="number"
              value={form.monthlySavingsGoal}
              onChange={(e) => setForm({ ...form, monthlySavingsGoal: e.target.value })}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-cc-muted uppercase">Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>
        <Button type="submit" className="!rounded-xl">
          <Save className="w-4 h-4" /> Save Profile
        </Button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-cc-forest mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cc-lime" /> Import CSV History
        </h2>
        <p className="text-sm text-cc-muted mb-4">
          Bulk-import past transactions. AI can suggest categories in batch (demo).
        </p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFile} />
        <Button variant="outline" className="!rounded-xl" onClick={() => fileRef.current?.click()}>
          Choose CSV file
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-cc-forest">Accessibility</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:border-cc-lime"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
            <Type className="w-4 h-4 text-cc-muted ml-2" />
            {['sm', 'md', 'lg'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                  fontSize === s ? 'bg-cc-forest text-white' : 'text-cc-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
