import { useState, useEffect } from "react";
import { FiX, FiStar, FiMessageSquare, FiSend } from "react-icons/fi";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
    show: boolean;
    onClose: () => void;
    orderSystem?: boolean;
}

const LOCAL_STORAGE_KEY = "feedbackSettings";

export default function FeedbackModal({ show, onClose }: Props) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [toast, setToast] = useState<string | null>(null);

    const [feedbackPhone, setFeedbackPhone] = useState("");

    useEffect(() => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            const data = JSON.parse(localData);
            if (data.feedbackPhone) setFeedbackPhone(data.feedbackPhone);
        }

        const feedbackRef = ref(db, "settings/complaintsWhatsapp");
        const unsubscribe = onValue(feedbackRef, (snapshot) => {
            if (snapshot.exists()) {
                const phone = snapshot.val();
                setFeedbackPhone(phone);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ feedbackPhone: phone }));
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!show) {
            setName("");
            setPhone("");
            setMessage("");
            setRating(0);
            setHoverRating(0);
        }
    }, [show]);

    const handleSend = () => {
        if (!message.trim()) {
            setToast(t('common.feedback_error_message'));
            setTimeout(() => setToast(null), 3000);
            return;
        }

        if (!feedbackPhone) {
            setToast(t('common.feedback_error_phone'));
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const fullMessage = `${t('whatsapp.rating_prefix')}\n------------------\n${t('whatsapp.name_prefix')}: ${name || "-"}\n${t('whatsapp.phone_prefix')}: ${phone || "-"}\n${t('whatsapp.rating_label')}: ${rating}/5\n${t('whatsapp.note_prefix')}: ${message || "-"}`;
        const url = `https://wa.me/${feedbackPhone}?text=${encodeURIComponent(fullMessage)}`;
        window.open(url, "_blank");

        setToast(t('common.feedback_success'));
        setTimeout(() => setToast(null), 3000);
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="absolute inset-0"
                        style={{ background: "rgba(26,10,10,0.78)", backdropFilter: "blur(10px)" }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 24 }}
                        transition={{ type: "spring", damping: 26, stiffness: 300 }}
                        className="relative w-full max-w-md overflow-y-auto max-h-[90vh] z-10"
                        style={{
                            background: "var(--display-yellow-card)",
                            border: "1.5px solid rgba(227,169,0,0.40)",
                            borderRadius: "var(--radius-hero)",
                            boxShadow: "0 32px 64px rgba(26,10,10,0.36), 0 8px 24px rgba(227,169,0,0.18)",
                            padding: "clamp(24px, 5vw, 40px)",
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            aria-label="إغلاق"
                            className="absolute top-5 end-5 flex items-center justify-center transition-all"
                            style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "var(--radius-md)",
                                background: "rgba(200,16,46,0.08)",
                                color: "var(--text-muted)",
                                border: "1.5px solid rgba(200,16,46,0.14)",
                                cursor: "pointer",
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
                            <FiX size={18} />
                        </button>

                        {/* Header */}
                        <div className="flex flex-col items-center mb-7">
                            <div
                                className="flex items-center justify-center mb-4"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--brand-gold)",
                                    boxShadow: "0 8px 24px rgba(227,169,0,0.45)",
                                }}
                            >
                                <FiMessageSquare size={28} color="var(--brand-dark)" />
                            </div>
                            <h2
                                className="font-black text-center"
                                style={{ fontSize: "22px", color: "var(--text-primary)", lineHeight: 1.2 }}
                            >
                                {t('common.feedback_title')}
                            </h2>
                            <p
                                className="text-center mt-1 font-semibold uppercase tracking-widest"
                                style={{ fontSize: "10px", color: "var(--text-muted)", opacity: 0.75 }}
                            >
                                {t('common.feedback_desc')}
                            </p>
                        </div>

                        {/* Gold divider */}
                        <div className="admin-gold-separator mb-6" />

                        <div className="flex flex-col gap-4">
                            {/* Name input */}
                            <input
                                type="text"
                                placeholder={t('common.name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full font-semibold outline-none"
                                style={{
                                    background: "rgba(255,253,242,0.85)",
                                    border: "1.5px solid rgba(227,169,0,0.30)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "12px 16px",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                    transition: "border-color var(--transition), box-shadow var(--transition)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--brand-gold-deep)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(227,169,0,0.18)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(227,169,0,0.30)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />

                            {/* Phone input */}
                            <input
                                type="tel"
                                dir="ltr"
                                placeholder={t('common.phone')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full font-semibold outline-none text-right"
                                style={{
                                    background: "rgba(255,253,242,0.85)",
                                    border: "1.5px solid rgba(227,169,0,0.30)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "12px 16px",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                    transition: "border-color var(--transition), box-shadow var(--transition)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--brand-gold-deep)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(227,169,0,0.18)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(227,169,0,0.30)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />

                            {/* Stars Rating */}
                            <div className="flex justify-center gap-2 py-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="relative transition-transform hover:scale-125 active:scale-95 p-1"
                                        style={{ background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        <FiStar
                                            size={30}
                                            style={{
                                                transition: "color 200ms, fill 200ms",
                                                color: star <= (hoverRating || rating) ? "var(--brand-gold-deep)" : "rgba(154,112,112,0.3)",
                                                fill: star <= (hoverRating || rating) ? "var(--brand-gold)" : "none",
                                                filter: star <= (hoverRating || rating) ? "drop-shadow(0 2px 8px rgba(227,169,0,0.5))" : "none",
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Message textarea */}
                            <textarea
                                placeholder={t('common.feedback_placeholder')}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full font-semibold outline-none resize-none"
                                rows={4}
                                style={{
                                    background: "rgba(255,253,242,0.85)",
                                    border: "1.5px solid rgba(227,169,0,0.30)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "12px 16px",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                    lineHeight: 1.6,
                                    transition: "border-color var(--transition), box-shadow var(--transition)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--brand-gold-deep)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(227,169,0,0.18)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "rgba(227,169,0,0.30)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />

                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                className="w-full flex items-center justify-center gap-3 font-black"
                                style={{
                                    height: "52px",
                                    borderRadius: "var(--radius-sm)",
                                    background: "var(--brand-red)",
                                    color: "white",
                                    border: "none",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    boxShadow: "var(--shadow-button)",
                                    transition: "background var(--transition), transform var(--transition), box-shadow var(--transition)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "var(--color-primary-600)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(200,16,46,0.32)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "var(--brand-red)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "var(--shadow-button)";
                                }}
                                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                                onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                            >
                                <FiSend size={18} />
                                {t('common.send_feedback')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                initial={{ opacity: 0, y: 30, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 30, x: "-50%" }}
                                className="fixed top-8 left-1/2 z-[110] font-black"
                                style={{
                                    background: "var(--brand-red)",
                                    color: "white",
                                    padding: "14px 28px",
                                    borderRadius: "var(--radius-full)",
                                    boxShadow: "0 16px 40px rgba(200,16,46,0.35)",
                                    border: "1.5px solid rgba(255,255,255,0.20)",
                                    backdropFilter: "blur(8px)",
                                    fontSize: "14px",
                                }}
                            >
                                {toast}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
}
