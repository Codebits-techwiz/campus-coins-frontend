import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { faqItems } from '../data/mockData';
import api from '../api';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function FaqChatbot() {
  const { t } = useTranslation();
  const { chatOpen, closeChat, toggleChat } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!chatOpen) return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: makeId(),
          role: 'bot',
          text: t('chatbot.welcome', { defaultValue: "Hi! 👋 I'm Campus Coin AI Assistant. Ask me anything about Campus Coin, student budgeting, or features!" }),
        },
      ];
    });
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [chatOpen, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, chatOpen]);

  const sendMessage = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: makeId(), role: 'user', text: trimmed };
    const historyForApi = messages.map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/chat', { message: trimmed, history: historyForApi });
      const botReply =
        res.data?.data?.reply ||
        "I'm having trouble connecting right now - please check our FAQ section below or try again shortly.";
      setMessages((prev) => [...prev, { id: makeId(), role: 'bot', text: botReply }]);
    } catch (err) {
      const fallbackMsg =
        err.response?.data?.error ||
        "I'm having trouble connecting right now - please check our FAQ section below or try again shortly.";
      setMessages((prev) => [...prev, { id: makeId(), role: 'bot', text: fallbackMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuestionChip = (item) => {
    const q = t(item.qKey);
    sendMessage(q);
  };

  const askedIds = new Set(
    messages
      .filter((m) => m.role === 'user')
      .map((m) => m.text)
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {chatOpen && (
        <div
          className="pointer-events-auto w-[min(100vw-2rem,23rem)] h-[min(70vh,30rem)] bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          <div className="bg-cc-forest text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-full bg-cc-lime/20 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-cc-lime" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight truncate flex items-center gap-1.5">
                  {t('chatbot.title', { defaultValue: 'Campus Coin AI Assistant' })}
                  <Sparkles className="w-3.5 h-3.5 text-cc-lime shrink-0 animate-pulse" />
                </p>
                <p className="text-[11px] text-white/60 truncate">
                  {t('chatbot.subtitle', { defaultValue: 'Powered by Gemini AI' })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="p-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label={t('chatbot.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-cc-mint-soft/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <span className="w-7 h-7 rounded-full bg-cc-forest text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </span>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cc-forest text-white rounded-br-md font-medium'
                      : 'bg-white text-cc-ink border border-gray-100 rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <span className="w-7 h-7 rounded-full bg-cc-lime text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <span className="w-7 h-7 rounded-full bg-cc-forest text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </span>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs text-cc-muted flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-cc-lime rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-cc-lime rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cc-lime rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1 text-[11px] font-medium text-cc-muted">AI is thinking...</span>
                </div>
              </div>
            )}

            {!loading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {faqItems.map((item) => {
                  const label = t(item.qKey);
                  if (askedIds.has(label)) return null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleQuestionChip(item)}
                      className="text-left text-[11px] font-medium px-3 py-1.5 rounded-full border border-cc-forest/15 bg-white text-cc-forest hover:bg-cc-mint hover:border-cc-lime transition shadow-sm"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="shrink-0 border-t border-gray-100 p-2.5 flex items-center gap-2 bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatbot.placeholder', { defaultValue: 'Ask AI about Campus Coin...' })}
              className="flex-1 min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-xs text-cc-ink placeholder:text-cc-muted focus:outline-none focus:ring-2 focus:ring-cc-lime/40 focus:border-cc-lime"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-cc-forest text-white hover:bg-cc-forest-light disabled:opacity-40 disabled:pointer-events-none transition"
              aria-label={t('chatbot.send')}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggleChat}
        className="pointer-events-auto w-14 h-14 rounded-full bg-cc-forest text-white shadow-lg shadow-cc-forest/30 flex items-center justify-center hover:bg-cc-forest-light hover:scale-105 active:scale-95 transition"
        aria-label={chatOpen ? t('chatbot.close') : t('chatbot.open')}
        title={chatOpen ? t('chatbot.close') : t('chatbot.open')}
      >
        {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
