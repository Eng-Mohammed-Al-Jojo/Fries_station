import { motion } from "framer-motion";
import { FiCopy, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { PaymentField } from "../../types/payment";

interface Props {
    fields: PaymentField[];
    methodName?: string;
    isCash?: boolean;
}

export default function PaymentFieldsRenderer({ fields, isCash }: Props) {
    const { t } = useTranslation();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(t('common.copied_to_clipboard') || "تم النسخ بنجاح");
        });
    };

    if (isCash) {
        return (
            <div
                className="flex items-center gap-4 rounded-2xl px-4 py-4"
                style={{
                    background: "rgba(255,210,46,0.06)",
                    border: "1.5px solid rgba(255,210,46,0.18)",
                }}
            >
                <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(255,210,46,0.12)",
                        color: "var(--brand-gold)",
                        border: "1px solid rgba(255,210,46,0.25)",
                    }}
                >
                    <FiInfo size={20} />
                </div>
                <div>
                    <p
                        className="font-extrabold leading-none"
                        style={{ fontSize: "14px", color: "var(--text-primary)" }}
                    >
                        الدفع عند الاستلام
                    </p>
                    <p
                        className="font-medium mt-1.5 leading-relaxed"
                        style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                        يرجى تجهيز المبلغ عند وصول الطلب
                    </p>
                </div>
            </div>
        );
    }

    if (!fields || fields.length === 0) {
        return (
            <div
                className="text-center py-6 rounded-2xl"
                style={{
                    border: "1.5px dashed rgba(255,210,46,0.20)",
                    background: "var(--bg-surface)",
                }}
            >
                <p
                    className="font-bold"
                    style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}
                >
                    لا توجد بيانات إضافية للتحويل
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            {fields.map((field, idx) => (
                <motion.div
                    key={field.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center justify-between rounded-2xl transition-all duration-200"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1.5px solid rgba(255,210,46,0.10)",
                        padding: "12px 14px",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,210,46,0.28)";
                        (e.currentTarget as HTMLDivElement).style.background = "var(--display-yellow-pale)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,210,46,0.10)";
                        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
                    }}
                >
                    <div className="flex flex-col flex-1 overflow-hidden pe-3">
                        <span
                            className="font-bold block mb-1"
                            style={{
                                fontSize: "10px",
                                color: "var(--brand-red)",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                opacity: 0.7,
                            }}
                        >
                            {field.label}
                        </span>
                        <span
                            className="font-extrabold select-all truncate"
                            style={{
                                fontSize: "15px",
                                color: "var(--text-primary)",
                                letterSpacing: "0.01em",
                            }}
                        >
                            {field.value}
                        </span>
                    </div>

                    <button
                        onClick={() => copyToClipboard(field.value)}
                        className="shrink-0 flex items-center justify-center transition-all duration-200 active:scale-90"
                        title="نسخ"
                        aria-label={`نسخ ${field.label}`}
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: "var(--bg-card)",
                            border: "1.5px solid rgba(255,210,46,0.15)",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-red)";
                            (e.currentTarget as HTMLButtonElement).style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,210,46,0.15)";
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                        }}
                    >
                        <FiCopy size={16} />
                    </button>
                </motion.div>
            ))}
        </div>
    );
}
