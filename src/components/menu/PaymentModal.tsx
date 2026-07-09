import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiX, FiCreditCard } from "react-icons/fi";
import type { PaymentMethod } from "../../types/payment";
import PaymentFieldsRenderer from "../common/PaymentFieldsRenderer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    methods: PaymentMethod[];
    isLoading?: boolean;
}

export default function PaymentModal({
    isOpen, onClose, methods, isLoading = false
}: Props) {
    useTranslation();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const enabledMethods = useMemo(() => methods.filter(m => m.isEnabled), [methods]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="absolute inset-0"
                style={{ background: "rgba(26,10,10,0.80)", backdropFilter: "blur(12px)" }}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 24 }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
                className="relative w-full max-w-lg flex flex-col z-10"
                style={{
                    background: "var(--bg-card)",
                    border: "1.5px solid rgba(227,169,0,0.38)",
                    borderRadius: "var(--radius-hero)",
                    boxShadow: "0 32px 72px rgba(26,10,10,0.38), 0 8px 28px rgba(227,169,0,0.16)",
                    maxHeight: "88vh",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between shrink-0"
                    style={{
                        padding: "24px 28px",
                        borderBottom: "1.5px solid rgba(227,169,0,0.22)",
                        background: "linear-gradient(135deg, var(--display-yellow-soft) 0%, var(--display-yellow) 100%)",
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center justify-center shrink-0"
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "var(--radius-md)",
                                background: "var(--brand-red)",
                                boxShadow: "var(--shadow-button)",
                            }}
                        >
                            <FiCreditCard size={24} color="white" />
                        </div>
                        <div>
                            <h3
                                className="font-black leading-tight"
                                style={{ fontSize: "20px", color: "var(--text-primary)" }}
                            >
                                طرق الدفع
                            </h3>
                            <p
                                className="uppercase tracking-widest font-bold mt-0.5"
                                style={{ fontSize: "9px", color: "var(--text-muted)" }}
                            >
                                بيانات التحويل المعتمدة
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="flex items-center justify-center transition-all"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "var(--radius-sm)",
                            background: "rgba(200,16,46,0.08)",
                            color: "var(--text-muted)",
                            border: "1.5px solid rgba(200,16,46,0.14)",
                            cursor: "pointer",
                            transition: "all var(--transition)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--brand-red)";
                            e.currentTarget.style.color = "white";
                            e.currentTarget.style.borderColor = "var(--brand-red)";
                            e.currentTarget.style.transform = "rotate(90deg)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(200,16,46,0.08)";
                            e.currentTarget.style.color = "var(--text-muted)";
                            e.currentTarget.style.borderColor = "rgba(200,16,46,0.14)";
                            e.currentTarget.style.transform = "rotate(0deg)";
                        }}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div
                    className="flex-1 overflow-y-auto custom-scrollbar"
                    style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "24px" }}
                >
                    {isLoading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {/* Gold shimmer skeleton */}
                                    <div
                                        className="skeleton-shimmer"
                                        style={{ height: "52px", borderRadius: "var(--radius-sm)", width: "55%" }}
                                    />
                                    <div
                                        className="skeleton-shimmer"
                                        style={{ height: "80px", borderRadius: "var(--radius-md)" }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : enabledMethods.length > 0 ? (
                        enabledMethods.map((method, index) => (
                            <div key={method.id}>
                                {/* Method card */}
                                <div
                                    className="admin-card"
                                    style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "16px" }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex items-center justify-center shrink-0"
                                            style={{
                                                width: "52px",
                                                height: "52px",
                                                borderRadius: "var(--radius-sm)",
                                                background: "var(--display-yellow-pale)",
                                                border: "1.5px solid rgba(227,169,0,0.28)",
                                                overflow: "hidden",
                                                padding: "8px",
                                            }}
                                        >
                                            {method.image ? (
                                                <img
                                                    src={method.image.startsWith('/') ? method.image : `/images/payment/${method.image}`}
                                                    alt={method.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            ) : <FiCreditCard size={24} color="var(--text-muted)" />}
                                        </div>
                                        <div>
                                            <h4
                                                className="font-black leading-none"
                                                style={{ fontSize: "17px", color: "var(--text-primary)" }}
                                            >
                                                {method.name}
                                            </h4>
                                            <div style={{ marginTop: "6px" }}>
                                                <span className="admin-badge-gold">
                                                    {method.type === 'cash' ? "نقدي" : method.type === 'wallet' ? "محفظة" : "بنكي"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <PaymentFieldsRenderer
                                        fields={method.paymentFields || []}
                                        isCash={method.type === 'cash'}
                                    />
                                </div>

                                {/* Separator between methods */}
                                {index < enabledMethods.length - 1 && (
                                    <div className="admin-gold-separator" style={{ marginTop: "8px" }} />
                                )}
                            </div>
                        ))
                    ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center text-center" style={{ padding: "48px 0" }}>
                            <div
                                className="flex items-center justify-center mb-5"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "var(--radius-lg)",
                                    background: "rgba(227,169,0,0.10)",
                                    border: "1.5px solid rgba(227,169,0,0.22)",
                                    fontSize: "36px",
                                }}
                            >
                                📵
                            </div>
                            <h4
                                className="font-black"
                                style={{ fontSize: "18px", color: "var(--text-primary)" }}
                            >
                                لا توجد وسائل دفع متاحة
                            </h4>
                            <p
                                className="font-semibold mt-2 uppercase tracking-wider"
                                style={{ fontSize: "11px", color: "var(--text-muted)", maxWidth: "240px" }}
                            >
                                يرجى التواصل مع الإدارة مباشرة لإتمام طلبك
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer tip */}
                <div
                    className="shrink-0"
                    style={{
                        padding: "16px 28px",
                        borderTop: "1px solid rgba(227,169,0,0.20)",
                        background: "rgba(255,248,207,0.50)",
                    }}
                >
                    <p
                        className="text-center font-semibold uppercase tracking-wider"
                        style={{ fontSize: "9px", color: "var(--text-muted)", lineHeight: 1.6 }}
                    >
                        تأكد من إرسال إشعار التحويل بعد إتمام العملية لضمان معالجة طلبك بأسرع وقت
                    </p>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && modalContent}
        </AnimatePresence>,
        document.body
    );
}
