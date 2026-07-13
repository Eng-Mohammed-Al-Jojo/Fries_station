import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiX, FiCreditCard, FiShield } from "react-icons/fi";
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

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const enabledMethods = useMemo(() => methods.filter(m => m.isEnabled), [methods]);

    const modalContent = (
        <div
            className="fixed inset-0 flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
            aria-modal="true"
            role="dialog"
            aria-label="طرق الدفع"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="absolute inset-0"
                style={{
                    background: "rgba(28, 14, 14, 0.72)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                }}
            />

            {/* Modal Panel */}
            <motion.div
                initial={{ opacity: 0, y: 48, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
                className="relative w-full sm:max-w-lg flex flex-col z-10 overflow-hidden"
                style={{
                    maxHeight: "92vh",
                    background: "var(--bg-main)",
                    borderRadius: "32px 32px 0 0",
                    boxShadow: "0 -8px 48px rgba(125,14,28,0.18), 0 0 0 1px rgba(255,210,46,0.10)",
                }}
                // sm: full rounded
                aria-modal="true"
            >
                {/* ─── Drag Handle (mobile) ─── */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                    <div
                        className="w-10 h-1 rounded-full"
                        style={{ background: "rgba(212,175,55,0.30)" }}
                    />
                </div>

                {/* ─── Header ─── */}
                <div
                    className="shrink-0 px-6 pt-4 pb-5 sm:pt-6 sm:px-8 sm:pb-6"
                    style={{
                        borderBottom: "1px solid rgba(255,210,46,0.12)",
                        background: "linear-gradient(160deg, var(--bg-hero) 0%, #6b0f1c 100%)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        {/* Left: Icon + Text */}
                        <div className="flex items-center gap-4">
                            {/* Icon disc */}
                            <div
                                className="shrink-0 flex items-center justify-center"
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "16px",
                                    background: "rgba(255,210,46,0.14)",
                                    border: "1.5px solid rgba(255,210,46,0.30)",
                                    color: "var(--brand-gold)",
                                    boxShadow: "0 4px 16px rgba(255,210,46,0.12)",
                                }}
                            >
                                <FiCreditCard size={24} />
                            </div>

                            <div>
                                <h3
                                    className="font-black leading-tight"
                                    style={{
                                        fontSize: "20px",
                                        color: "var(--brand-gold)",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    طرق الدفع
                                </h3>
                                <p
                                    className="font-semibold mt-0.5"
                                    style={{
                                        fontSize: "11px",
                                        color: "rgba(255,255,255,0.55)",
                                        letterSpacing: "0.06em",
                                    }}
                                >
                                    بيانات التحويل المعتمدة
                                </p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            aria-label="إغلاق"
                            className="flex items-center justify-center transition-all duration-200 active:scale-90"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "rgba(255,255,255,0.70)",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,210,46,0.18)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,210,46,0.40)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-gold)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.70)";
                            }}
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </div>

                {/* ─── Scrollable Content ─── */}
                <div
                    className="flex-1 overflow-y-auto custom-scrollbar"
                    style={{ padding: "24px 24px 0", }}
                >
                    {isLoading ? (
                        /* Loading skeleton */
                        <div className="space-y-5 pb-6">
                            {[1, 2].map(i => (
                                <div
                                    key={i}
                                    className="rounded-[22px] overflow-hidden"
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid rgba(255,210,46,0.10)",
                                        padding: "20px",
                                    }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="skeleton-shimmer rounded-2xl shrink-0"
                                            style={{ width: "52px", height: "52px" }}
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div className="skeleton-shimmer rounded-lg h-4 w-1/3" />
                                            <div className="skeleton-shimmer rounded-lg h-3 w-1/4" />
                                        </div>
                                    </div>
                                    <div className="skeleton-shimmer rounded-xl h-14" />
                                </div>
                            ))}
                        </div>
                    ) : enabledMethods.length > 0 ? (
                        <div className="space-y-4 pb-4">
                            {enabledMethods.map((method, methodIdx) => (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: methodIdx * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    className="rounded-[22px] overflow-hidden"
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid rgba(255,210,46,0.12)",
                                        boxShadow: "var(--shadow-card)",
                                    }}
                                >
                                    {/* Method Header */}
                                    <div
                                        className="flex items-center gap-4 px-5 py-4"
                                        style={{ borderBottom: "1px solid rgba(255,210,46,0.08)" }}
                                    >
                                        {/* Method logo */}
                                        <div
                                            className="shrink-0 overflow-hidden flex items-center justify-center"
                                            style={{
                                                width: "52px",
                                                height: "52px",
                                                borderRadius: "14px",
                                                background: "var(--bg-surface)",
                                                border: "1.5px solid rgba(255,210,46,0.15)",
                                                padding: "6px",
                                            }}
                                        >
                                            {method.image ? (
                                                <img
                                                    src={method.image.startsWith('/') ? method.image : `/images/payment/${method.image}`}
                                                    alt={method.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : <FiCreditCard size={24} style={{ color: "var(--text-muted)" }} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4
                                                className="font-extrabold truncate leading-none"
                                                style={{
                                                    fontSize: "17px",
                                                    color: "var(--text-primary)",
                                                }}
                                            >
                                                {method.name}
                                            </h4>
                                            <span
                                                className="inline-flex items-center mt-1.5 font-bold"
                                                style={{
                                                    fontSize: "10px",
                                                    paddingInline: "10px",
                                                    paddingBlock: "3px",
                                                    borderRadius: "999px",
                                                    background: "rgba(212,10,37,0.07)",
                                                    color: "var(--brand-red)",
                                                    border: "1px solid rgba(212,10,37,0.12)",
                                                    letterSpacing: "0.05em",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                {method.type === 'cash' ? "نقدي" : method.type === 'wallet' ? "محفظة إلكترونية" : "تحويل بنكي"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="px-5 py-4">
                                        <PaymentFieldsRenderer
                                            fields={method.paymentFields || []}
                                            isCash={method.type === 'cash'}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-center pb-8"
                        >
                            <div
                                className="flex items-center justify-center text-5xl mb-5"
                                style={{
                                    width: "88px",
                                    height: "88px",
                                    borderRadius: "28px",
                                    background: "var(--bg-card)",
                                    border: "1.5px solid rgba(255,210,46,0.12)",
                                    boxShadow: "var(--shadow-card)",
                                }}
                            >
                                📵
                            </div>
                            <h4
                                className="font-black mb-2"
                                style={{ fontSize: "18px", color: "var(--text-primary)" }}
                            >
                                لا توجد وسائل دفع متاحة
                            </h4>
                            <p
                                className="font-semibold max-w-[240px] leading-relaxed"
                                style={{ fontSize: "12px", color: "var(--text-muted)" }}
                            >
                                يرجى التواصل مع الإدارة مباشرة لإتمام طلبك
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* ─── Footer tip ─── */}
                <div
                    className="shrink-0 flex items-start gap-3 mx-5 mb-5 mt-3 rounded-2xl px-4 py-3"
                    style={{
                        background: "rgba(255,210,46,0.06)",
                        border: "1px solid rgba(255,210,46,0.14)",
                    }}
                >
                    <div
                        className="shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: "rgba(255,210,46,0.12)",
                            color: "var(--brand-gold)",
                        }}
                    >
                        <FiShield size={14} />
                    </div>
                    <p
                        className="font-semibold leading-relaxed flex-1"
                        style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                        }}
                    >
                        تأكد من إرسال إشعار التحويل بعد إتمام العملية لضمان معالجة طلبك بأسرع وقت
                    </p>
                </div>

                {/* Safe area for iOS */}
                <div className="shrink-0 pb-safe" style={{ minHeight: "env(safe-area-inset-bottom, 0px)" }} />
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
