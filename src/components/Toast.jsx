import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}

const iconMap = {
    success: <FiCheckCircle size={18} />,
    error: <FiAlertTriangle size={18} />,
    info: <FiInfo size={18} />,
};

function ToastItem({ toast, onRemove }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <motion.div
            className={`toast toast--${toast.type}`}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <span className="toast__icon">{iconMap[toast.type]}</span>
            <span className="toast__message">{toast.message}</span>
            <div
                className="toast__progress"
                style={{ animationDuration: `${toast.duration}ms` }}
            />
        </motion.div>
    );
}

export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container" aria-live="polite">
            <AnimatePresence>
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
}
