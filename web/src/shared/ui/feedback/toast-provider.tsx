"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    toast: (props: Omit<Toast, "id">) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        ({ type, title, message, duration = 5000 }: Omit<Toast, "id">) => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((prev) => [...prev, { id, type, title, message, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const helpers = {
        success: (message: string, title?: string) =>
            addToast({ type: "success", message, title }),
        error: (message: string, title?: string) =>
            addToast({ type: "error", message, title }),
        warning: (message: string, title?: string) =>
            addToast({ type: "warning", message, title }),
        info: (message: string, title?: string) =>
            addToast({ type: "info", message, title }),
    };

    return (
        <ToastContext.Provider value={{ toast: addToast, ...helpers }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const borderColors = {
        success: "border-green-200 bg-green-50",
        error: "border-red-200 bg-red-50",
        warning: "border-yellow-200 bg-yellow-50",
        info: "border-blue-200 bg-blue-50",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto flex items-start w-full p-4 rounded-lg border shadow-lg bg-white",
                // borderColors[toast.type] // Opcional: usar colores de fondo/borde suaves
            )}
        >
            <div className="flex-shrink-0 mr-3">{icons[toast.type]}</div>
            <div className="flex-1 mr-2">
                {toast.title && <h4 className="text-sm font-semibold text-gray-900">{toast.title}</h4>}
                <p className="text-sm text-gray-700 leading-tight">{toast.message}</p>
            </div>
            <button
                onClick={onDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
