// components/ui/ToastProvider.tsx

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { toastEmitter, ToastMessage, ToastType } from '@/lib/utils/toast';

interface ToastContextType {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Date.now().toString(); // Simple ID generation for now
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((newToast) => {
      setToasts((prevToasts) => [...prevToasts, newToast]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        const oldestToast = toasts[0];
        if (oldestToast.duration) {
          dismissToast(oldestToast.id);
        }
      }, toasts[0]?.duration || 3000); // Dismiss oldest toast after its duration

      return () => clearTimeout(timer);
    }
  }, [toasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="toast-container fixed bottom-4 right-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-md shadow-lg mb-3
              ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
            `}
          >
            <span>{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} className="ml-4 font-bold">
              X
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};