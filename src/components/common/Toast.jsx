import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
                isSuccess
                  ? 'bg-emerald-950/92 text-emerald-100 border-emerald-500/40 shadow-emerald-950/20'
                  : isError
                  ? 'bg-rose-950/92 text-rose-100 border-rose-500/40 shadow-rose-950/20'
                  : 'bg-[#0A1C35]/95 text-sky-100 border-teal-500/30 shadow-slate-950/30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
                {isError && <AlertCircle size={18} className="text-rose-400" />}
                {!isSuccess && !isError && <Info size={18} className="text-[#0BC2A8]" />}
              </div>

              <div className="flex-1 text-xs font-bold leading-relaxed">
                {toast.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
