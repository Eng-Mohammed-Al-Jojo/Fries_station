import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import type { Item } from "./Menu";
import { toast } from "react-hot-toast";

interface Props {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemModal({ item, isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  if (!item) return null;

  const prices = String(item.price).split(",").map((p) => Number(p.trim()));
  const currentPrice = prices[selectedPriceIndex];
  const itemName = item.nameAr || item.name || "";

  const handleAdd = () => {
    const optionLabel =
      prices.length > 1 ? `${t("common.select")} ${selectedPriceIndex + 1}` : undefined;
    addItem(item, currentPrice, quantity, optionLabel);
    toast.success(t("common.added_to_cart") || "تمت الإضافة للطلب!");
    onClose();
    setQuantity(1);
    setSelectedPriceIndex(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: 100 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(26,10,10,0.65)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full flex flex-col overflow-hidden"
            style={{
              maxWidth: "480px",
              borderRadius: "var(--radius-hero)",
              background: "var(--bg-card)",
              boxShadow: "0 24px 64px rgba(26,10,10,0.30)",
              border: "1px solid var(--border-light)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute flex items-center justify-center z-10"
              style={{
                top: "20px",
                left: "20px",
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-full)",
                background: "rgba(26,10,10,0.40)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                transition: "background var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,10,10,0.40)";
              }}
            >
              <FiX size={18} />
            </button>

            {/* Image hero */}
            <div className="relative shrink-0" style={{ height: "240px" }}>
              <img
                src={item.image ? `/images/${item.image}` : "/logo.png"}
                alt={itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
              {/* Red gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--bg-card) 0%, rgba(200,16,46,0.12) 50%, transparent 100%)",
                }}
              />
            </div>

            {/* Content */}
            <div
              className="relative flex flex-col"
              style={{
                padding: "28px 32px 32px",
                marginTop: "-20px",
                background: "var(--bg-card)",
                borderTopLeftRadius: "32px",
                borderTopRightRadius: "32px",
                gap: "20px",
              }}
            >
              {/* Title + Price row */}
              <div className="flex items-start justify-between gap-4">
                <h2
                  className="font-bold leading-tight"
                  style={{ fontSize: "22px", color: "var(--text-primary)" }}
                >
                  {itemName}
                </h2>
                <div
                  className="flex items-baseline gap-1 shrink-0 font-black"
                  style={{ fontSize: "22px", color: "var(--brand-red)" }}
                >
                  {currentPrice}
                  <small style={{ fontSize: "13px", opacity: 0.65, fontWeight: 700 }}>₪</small>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--border-light)" }} />

              {/* Variant selector (multiple prices) */}
              {prices.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span
                    className="font-semibold uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.12em", color: "var(--text-muted)" }}
                  >
                    {t("common.select") || "اختر..."}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {prices.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPriceIndex(idx)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "var(--radius-md)",
                          fontWeight: 700,
                          fontSize: "14px",
                          transition: "all var(--transition)",
                          border: selectedPriceIndex === idx
                            ? "2px solid var(--brand-red)"
                            : "1.5px solid var(--border-base)",
                          background: selectedPriceIndex === idx
                            ? "var(--brand-red)"
                            : "var(--bg-main)",
                          color: selectedPriceIndex === idx ? "white" : "var(--text-primary)",
                          boxShadow: selectedPriceIndex === idx ? "var(--shadow-button)" : "none",
                          cursor: "pointer",
                        }}
                      >
                        {p}₪
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span
                  className="font-semibold uppercase"
                  style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-primary)" }}
                >
                  {t("common.quantity") || "الكمية"}
                </span>
                <div
                  className="flex items-center"
                  style={{
                    gap: "16px",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-main)",
                    border: "1.5px solid var(--border-base)",
                  }}
                >
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="تقليل الكمية"
                    className="flex items-center justify-center"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-card)",
                      border: "1.5px solid var(--border-light)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "color var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-red)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <FiMinus size={16} />
                  </motion.button>

                  <span
                    className="font-black text-center"
                    style={{ width: "28px", fontSize: "18px", color: "var(--text-primary)" }}
                  >
                    {quantity}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="زيادة الكمية"
                    className="flex items-center justify-center"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-card)",
                      border: "1.5px solid var(--border-light)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "color var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-red)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <FiPlus size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Add to order CTA */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                aria-label={`إضافة ${itemName} للطلب`}
                className="w-full flex items-center justify-center gap-3 font-semibold"
                style={{
                  height: "56px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--brand-red)",
                  color: "white",
                  fontSize: "16px",
                  boxShadow: "var(--shadow-button)",
                  border: "none",
                  cursor: "pointer",
                  transition: "background var(--transition)",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-600)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                }}
              >
                <FiShoppingCart size={20} />
                <span>{t("common.add_to_order") || "إضافة للطلب"}</span>
                <span style={{ margin: "0 4px", opacity: 0.35 }}>|</span>
                <span style={{ fontWeight: 800 }}>{currentPrice * quantity}₪</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
