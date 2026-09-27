import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api';
import {
  currentStudent,
  defaultCategories,
  personalCategories,
  initialTransactions,
  initialBudgets,
  initialInsights,
  initialTips,
  adminUsers as seedUsers,
  announcements as seedAnnouncements,
  suggestCategory,
} from '../data/mockData';

export const AppContext = createContext(null);
export default AppContext;

export function AppProvider({ children }) {
  const [role, setRole] = useState('public');
  const [toast, setToast] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txPagination, setTxPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [insights, setInsights] = useState(initialInsights);
  const [tips, setTips] = useState(initialTips);
  const [users, setUsers] = useState(seedUsers);
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [siteContent, setSiteContent] = useState(null);
  const [branding, setBranding] = useState(null);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen((v) => !v), []);

  const refreshSiteContent = useCallback(async () => {
    try {
      const res = await api.get('/api/site-content');
      if (res.data.success && res.data.data) {
        setSiteContent(res.data.data);
        if (res.data.data.branding) {
          setBranding(res.data.data.branding);
        }
      }
    } catch (err) {
      console.error('Failed to load site content in AppContext', err);
    }
  }, []);

  useEffect(() => {
    refreshSiteContent();
  }, [refreshSiteContent]);

  useEffect(() => {
    const checkSession = async () => {
      const isLoggedIn = localStorage.getItem('cc_logged_in') === 'true';
      if (!isLoggedIn) {
        setProfile(null);
        setRole('public');
        setAuthLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/users/profile');
        if (res.data.success) {
          setProfile(res.data.data);
          setRole(res.data.data.role); // 'student' or 'admin'
          localStorage.setItem('cc_logged_in', 'true');
          setAuthLoading(false);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('cc_logged_in');
          setProfile(null);
          setRole('public');
          setAuthLoading(false);
        } else if (err.response?.status === 429) {
          // Rate limited. Do not touch session. Retry silently.
          setTimeout(checkSession, 1500);
        } else {
          localStorage.removeItem('cc_logged_in');
          setProfile(null);
          setRole('public');
          setAuthLoading(false);
        }
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('cc_logged_in', 'true');
    }
  }, [profile]);


  useEffect(() => {
    if (role === 'student' || role === 'admin') {
      const currentMonth = new Date().toISOString().slice(0, 7);

      api.get('/api/categories')
        .then((res) => {
          if (res.data.success) setCategories(res.data.data);
          else console.error('[AppContext] categories fetch: success=false', res.data);
        })
        .catch((err) => console.error('[AppContext] categories fetch error:', err));

      api.get('/api/transactions')
        .then((res) => {
          if (res.data.success) {
            setTransactions(res.data.data.transactions ?? res.data.data ?? []);
            setTxPagination(res.data.data.pagination ?? { total: 0, page: 1, pages: 1 });
          } else {
            console.error('[AppContext] transactions fetch: success=false', res.data);
          }
        })
        .catch((err) => console.error('[AppContext] transactions fetch error:', err));

      api.get(`/api/budgets?month=${currentMonth}`)
        .then((res) => {
          if (res.data.success) setBudgets(res.data.data);
          else console.error('[AppContext] budgets fetch: success=false', res.data);
        })
        .catch((err) => console.error('[AppContext] budgets fetch error:', err));

      api.get('/api/dashboard/summary')
        .then((res) => {
          if (res.data.success) setDashboardSummary(res.data.data);
        })
        .catch(() => {});

      api.get('/api/notifications')
        .then((res) => {
          if (res.data.success) {
            setNotifications(res.data.data.notifications ?? []);
            setUnreadCount(res.data.data.unreadCount ?? 0);
          }
        })
        .catch(() => {});

      api.get('/api/announcements')
        .then((res) => {
          if (res.data.success) {
            setAnnouncements(res.data.data ?? []);
          }
        })
        .catch(() => {});
    } else {
      setCategories([]);
      setTransactions([]);
      setBudgets([]);
      setNotifications([]);
      setUnreadCount(0);
      setDashboardSummary(null);
      setAnnouncements([]);
    }
  }, [role]);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cc-theme') === 'dark');
  const [fontSize, setFontSize] = useState('md');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    localStorage.setItem('cc-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    document.body.classList.remove('font-sm', 'font-lg');
    if (fontSize === 'sm') document.body.classList.add('font-sm');
    if (fontSize === 'lg') document.body.classList.add('font-lg');
  }, [fontSize]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    showToast(`Switched to ${newRole.toUpperCase()} mode`, 'success');
  };

  const addTransaction = async (tx) => {
    try {

      const isoDate = tx.date
        ? new Date(tx.date + 'T00:00:00').toISOString()
        : new Date().toISOString();

      const res = await api.post('/api/transactions', {
        category: tx.categoryId,
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description,
        date: isoDate,
      });
      if (res.data.success) {
        setTransactions((prev) => [res.data.data, ...prev]);
        showToast('Transaction added', 'success');
        return true;
      } else {
        showToast(res.data.error || 'Failed to add transaction', 'error');
        return false;
      }
    } catch (err) {
      console.error('addTransaction error:', err);
      const data = err.response?.data;
      let msg = 'Failed to add transaction';
      if (data?.error) {
        msg = Array.isArray(data.error) ? (data.error[0].message || data.error[0].msg) : data.error;
      }
      showToast(msg, 'error');
      return false;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const payload = {};
      if (updates.amount !== undefined) payload.amount = Number(updates.amount);
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.categoryId !== undefined) payload.category = updates.categoryId;
      if (updates.type !== undefined) payload.type = updates.type;
      if (updates.date !== undefined) {

        const d = updates.date;
        payload.date = d.includes('T') ? d : new Date(d + 'T00:00:00').toISOString();
      }

      const res = await api.put(`/api/transactions/${id}`, payload);
      if (res.data.success) {
        setTransactions((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
        showToast('Transaction updated', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update transaction', 'error');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      showToast('Transaction deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete transaction', 'error');
    }
  };

  const addCategory = async (cat) => {
    try {
      const res = await api.post('/api/categories', cat);
      if (res.data.success) {
        setCategories((prev) => [...prev, res.data.data]);
        showToast('Category created', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create category', 'error');
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await api.put(`/api/categories/${id}`, updates);
      if (res.data.success) {
        setCategories((prev) => prev.map((c) => (c._id === id ? res.data.data : c)));
        showToast('Category updated', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Cannot update default category', 'error');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      showToast('Category deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Cannot delete this category', 'error');
    }
  };

  const adminUpsertCategory = (cat) => {
    if (cat.id) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c)));
      showToast('Category saved', 'success');
    } else {
      const id = `c${Date.now()}`;
      setCategories((prev) => [...prev, { ...cat, id, isDefault: true }]);
      showToast('Default category added', 'success');
    }
  };

  const adminDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'success');
  };

  const addBudget = async (budget) => {
    try {
      const res = await api.post('/api/budgets', budget);
      if (res.data.success) {
        setBudgets((prev) => [...prev, res.data.data]);
        showToast('Budget saved', 'success');
        return true;
      } else {
        showToast(res.data.error || 'Failed to save budget', 'error');
        return false;
      }
    } catch (err) {
      console.error('addBudget error:', err);
      const data = err.response?.data;
      let msg = 'Failed to save budget';
      if (data?.error) {
        msg = Array.isArray(data.error) ? (data.error[0].message || data.error[0].msg) : data.error;
      }
      showToast(msg, 'error');
      return false;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await api.delete(`/api/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => (b._id || b.id) !== id));
      showToast('Budget removed', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete budget', 'error');
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[AppContext] mark notification read error:', err);
    }
  };

  const toggleTipPin = (id) => {
    setTips((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  };

  const dismissTip = (id) => {
    setTips((prev) => prev.map((t) => (t.id === id ? { ...t, dismissed: true } : t)));
    showToast('Tip dismissed', 'success');
  };

  const toggleInsightPin = (id) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i)));
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u
      )
    );
    showToast('User status updated', 'success');
  };

  const resetUserPassword = (id) => {
    showToast(`Password reset link sent for user ${id}`, 'success');
  };

  const addAnnouncement = (ann) => {
    setAnnouncements((prev) => [
      { ...ann, id: `a${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    showToast('Announcement created', 'success');
  };

  const updateAnnouncement = (id, updates) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Announcement updated', 'success');
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted', 'success');
  };

  const importCsv = (count) => {
    showToast(`Imported ${count} transactions from CSV (demo)`, 'success');
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthSpent = (categoryId) =>
    transactions
      .filter((t) => t.type === 'expense' && (t.category?._id === categoryId || t.category === categoryId) && t.date?.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);

  const monthIncome = transactions
    .filter((t) => t.type === 'income' && t.date?.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const monthExpense = transactions
    .filter((t) => t.type === 'expense' && t.date?.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const value = {
    authLoading,
    role,
    switchRole,
    setRole,
    toast,
    showToast,
    transactions,
    txPagination,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    adminUpsertCategory,
    adminDeleteCategory,
    budgets,
    addBudget,
    deleteBudget,
    monthSpent,
    notifications,
    unreadCount,
    markNotificationRead,
    dashboardSummary,
    insights,
    tips,
    toggleTipPin,
    dismissTip,
    toggleInsightPin,
    users,
    toggleUserStatus,
    resetUserPassword,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    profile,
    setProfile,
    importCsv,
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
    monthIncome,
    monthExpense,
    balance: monthIncome - monthExpense,
    suggestCategory,
    chatOpen,
    openChat,
    closeChat,
    toggleChat,
    siteContent,
    branding,
    refreshSiteContent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
