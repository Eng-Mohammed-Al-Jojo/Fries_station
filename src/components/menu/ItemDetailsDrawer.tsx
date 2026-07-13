import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { Item } from "./Menu";
import { getIngredientList } from "../../utils/stringUtils";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";

interface Props {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  orderSystem?: boolean;
}

export default function ItemDetailsDrawer({ item, isOpen, onClose, orderSystem = true }: Props) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Set initial focus
    firstElement.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!item) return null;

  const itemName = item.nameAr || item.name || "";
  const itemDescription = item.ingredientsAr || item.ingredients || "";
  const itemNotes = (item as any).notesAr || (item as any).notes || "";
  const unavailable = item.visible === false;
  const canOrder = !unavailable && orderSystem;


  const handleAddToOrder = () => {
    if (!canOrder || isAdding) return;
    setIsAdding(true);

    const rawPrice = String(item.price).split(",")[0];
    const numericPrice = parseFloat(rawPrice);

    addItem(item, numericPrice);

    toast.success(`${itemName} ${t("common.added_to_cart")}`, {
      icon: "🛒",
      position: "top-center",
      style: {
        borderRadius: "24px",
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-base)",
        fontFamily: "Cairo",
        fontWeight: "bold",
        fontSize: "14px",
      },
    });

    setTimeout(() => {
      onClose();
      setIsAdding(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: 100 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop (Fade + Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(20, 8, 8, 0.72)",
              backdropFilter: "blur(10px)",
            }}
          />

          {/* Dialog Panel (Fade + Scale 95% -> 100%) */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative flex flex-col w-full overflow-hidden"
            style={{
              maxWidth: "520px",
              maxHeight: "85vh",
              background: "#FFF8E7", /* Premium warm cream base */
              boxShadow: "0 24px 64px rgba(26,10,10,0.35)",
              border: "1.5px solid rgba(245,197,24,0.25)", /* Gold tint border */
              borderRadius: "28px", /* Large premium border radius */
              zIndex: 10,
            }}
          >
            {/* ── Hero Image (16:9 ratio) ── */}
            <div
              className="relative shrink-0 overflow-hidden w-full"
              style={{ aspectRatio: "16/9" }}
            >
              <motion.img
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ willChange: "transform" }}
                src={item.image ? `/images/${item.image}` : "/logo.png"}
                alt={itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #FFF8E7 0%, rgba(200,16,46,0.15) 50%, rgba(26,10,10,0.3) 100%)",
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="absolute flex items-center justify-center cursor-pointer"
                style={{
                  top: "20px",
                  right: "20px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(20, 8, 8, 0.45)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: 20,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg) scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(20, 8, 8, 0.45)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg) scale(1)";
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar text-right"
              style={{
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* 1. Product Name */}
              <h2
                className="font-semibold leading-tight"
                style={{ fontSize: "30px", color: "var(--text-primary)", fontFamily: "Alexandria", fontWeight: 600 }}
              >
                {itemName}
              </h2>



              <div style={{ height: "1px", background: "rgba(200,16,46,0.1)" }} />



              {/* 3. Ingredients */}
              {getIngredientList(itemDescription).length > 0 && (
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "var(--text-muted)",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "10px",
                      fontFamily: "Cairo",
                    }}
                  >
                    {t("admin.ingredients_label") || "المكونات"}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {getIngredientList(itemDescription).map((ingredient, idx) => (
                      <div
                        key={idx}
                        style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}
                      >
                        <span
                          className="font-medium"
                          style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "Cairo", fontWeight: 500 }}
                        >
                          {ingredient}
                        </span>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--brand-gold)",
                            boxShadow: "0 0 5px rgba(255,210,46,0.6)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Notes */}
              {itemNotes && (
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(200,16,46,0.04)",
                    borderRadius: "14px",
                    borderRight: "4px solid var(--brand-red)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "var(--brand-red)",
                      display: "block",
                      marginBottom: "4px",
                      fontFamily: "Cairo",
                    }}
                  >
                    {t("menu.notes") || "ملاحظات"}
                  </span>
                  <p
                    className="leading-relaxed font-medium"
                    style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "Cairo", fontWeight: 500 }}
                  >
                    {itemNotes}
                  </p>
                </div>
              )}

              <div style={{ height: "1px", background: "rgba(200,16,46,0.1)" }} />

              {/* 5. Price */}
              <div className="flex justify-between items-center">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                    fontFamily: "Cairo",
                  }}
                >
                  {t("common.price") || "السعر"}
                </span>
                <div
                  className="flex flex-wrap items-baseline gap-1.5 font-black"
                  style={{ color: "var(--brand-red)" }}
                >
                  {String(item.price).split(",").map((p) => p.trim()).filter(Boolean).map((price, idx) => (
                    <div
                      key={idx}
                      className={`flex items-baseline gap-0.5 font-black ${String(item.price).split(",").length > 1 ? "text-[16px]" : "text-[26px]"} leading-none`}
                      style={{ fontFamily: "Cairo" }}
                    >
                      <span className="text-[12px] font-bold opacity-70">₪</span>
                      {price}
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Availability Badge */}
              <div className="flex justify-between items-center">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t("common.status") || "الحالة"}
                </span>
                {unavailable ? (
                  <span
                    className="font-bold shadow-sm"
                    style={{
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(200,16,46,0.1)",
                      color: "var(--brand-red)",
                      border: "1px solid rgba(200,16,46,0.2)",
                    }}
                  >
                    {t("menu.sold_out") || "نفذت الكمية"}
                  </span>
                ) : (
                  <span
                    className="font-bold shadow-sm"
                    style={{
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(40,167,69,0.12)",
                      color: "#28a745",
                      border: "1px solid rgba(40,167,69,0.25)",
                    }}
                  >
                    {t("menu.available") || "متوفر حالياً"}
                  </span>
                )}
              </div>
            </div>

            {/* ── Sticky Footer (Add to order) ── */}
            {canOrder && (
              <div
                style={{
                  padding: "20px 28px",
                  borderTop: "1px solid rgba(200,16,46,0.08)",
                  background: "rgba(255,248,231,0.65)", /* Match warm theme */
                  backdropFilter: "blur(4px)",
                }}
              >
                <button
                  onClick={handleAddToOrder}
                  disabled={isAdding}
                  aria-label={`إضافة ${itemName} للطلب`}
                  className="w-full flex items-center justify-center gap-3 font-semibold group cursor-pointer"
                  style={{
                    height: "54px",
                    borderRadius: "var(--radius-full)",
                    background: isAdding ? "rgba(200,16,46,0.65)" : "var(--brand-red)",
                    color: "white",
                    fontSize: "16px",
                    boxShadow: "var(--shadow-button)",
                    border: "none",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdding) {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-600)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdding) {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isAdding ? (
                    <div
                      className="rounded-full"
                      style={{
                        width: "22px",
                        height: "22px",
                        border: "2.5px solid rgba(255,255,255,0.30)",
                        borderTopColor: "white",
                        animation: "spin 0.75s linear infinite",
                      }}
                    />
                  ) : (
                    <>
                      <FiShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                      {t("common.add_to_order")}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}