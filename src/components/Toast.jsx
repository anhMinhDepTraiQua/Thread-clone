import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

/**
 * Toast Notification Component
 * Usage: 
 * import { toast } from './Toast';
 * toast.error("Something went wrong!");
 * toast.success("Action completed!");
 */

let toastId = 0;
const toastListeners = new Set();

export const toast = {
  error: (message) => {
    notifyListeners({ id: toastId++, type: "error", message });
  },
  success: (message) => {
    notifyListeners({ id: toastId++, type: "success", message });
  },
  info: (message) => {
    notifyListeners({ id: toastId++, type: "info", message });
  },
};

function notifyListeners(toast) {
  toastListeners.forEach((listener) => listener(toast));
}

function ToastItem({ toast, onClose }) {
  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    error: "bg-red-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className={`${colors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slide-in`}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts((prev) => [...prev, toast]);
    };

    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

// CSS Animation (thêm vào global CSS hoặc Tailwind config)
const styles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`;