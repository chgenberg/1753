"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : undefined}
            aria-live={toast.type === "error" ? "assertive" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-fade-in",
              toast.type === "success" && "bg-green-50 text-green-900",
              toast.type === "error" && "bg-red-50 text-red-900",
              toast.type === "info" && "bg-brand-50 text-brand-900"
            )}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              type="button"
              aria-label="Stäng"
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full hover:bg-black/10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
