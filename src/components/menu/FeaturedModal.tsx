import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingCart, FiInfo } from "react-icons/fi";
import { HiStar } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { Item } from "./Menu";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  orderSystem: boolean;
  onItemClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

export default function FeaturedModal({
  isOpen,
  onClose,
  items,
  orderSystem,
  onItemClick,
  onDetailsClick,
}: Props) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-0 sm:p-6"
          style={{ zIndex: 100 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: "var(--dark-a85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex flex-col w-full h-full sm:h-auto"
            style={{ maxWidth: "1100px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-4 sm:p-0 sm:mb-6">
              <div className="flex items-center gap-3">
                {/* Gold icon disc */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--brand-gold)",
                    boxShadow: "0 4px 20px var(--gold-a40)",
                  }}
                >
                  <HiStar size={24} color="var(--brand-dark)" />
                </div>
                <div>
                  <h2
                    className="font-black leading-tight drop-shadow-md"
                    style={{ fontSize: "24px", color: "white" }}
                  >
                    {t("menu.featured_items") || "الأصناف المميزة"}
                  </h2>
                  <p
                    className="font-bold"
                    style={{
                      fontSize: "13px",
                      color: "var(--brand-gold)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("menu.chef_recommendations") || "توصيات الشيف"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="إغلاق"
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255,255,255,0.10)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-red)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg)";
                }}
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Carousel */}
            <div
              className="flex-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                padding: "20px 24px",
                display: "flex",
                gap: "24px",
                alignItems: "center",
              }}
            >
              {items.length > 0 ? (
                items.map((item, index) => {
                  const prices = String(item.price).split(",").map((p) => p.trim()).filter(Boolean);
                  const itemName = item.nameAr || item.name || "";
                  const description = item.ingredientsAr || item.ingredients || "";
                  const unavailable = item.visible === false;
                  const canOrder = !unavailable && orderSystem;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="relative shrink-0 flex flex-col group"
                      style={{
                        scrollSnapAlign: "center",
                        width: "85vw",
                        maxWidth: "340px",
                        height: "480px",
                        borderRadius: "var(--radius-hero)",
                        background: "var(--bg-card)",
                        border: "1.5px solid var(--gold-a25)",
                        boxShadow: "0 24px 48px var(--dark-a72)",
                        overflow: "hidden",
                        opacity: unavailable ? 0.6 : 1,
                        transition: "transform var(--transition), box-shadow var(--transition)",
                        cursor: unavailable ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (unavailable) return;
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 32px 64px var(--dark-a85)";
                      }}
                      onMouseLeave={(e) => {
                        if (unavailable) return;
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 24px 48px var(--dark-a72)";
                      }}
                      onClick={() => {
                        if (unavailable) return;
                        onDetailsClick?.(item);
                        onClose();
                      }}
                    >
                      {/* Image Area */}
                      <div className="relative h-1/2 w-full overflow-hidden">
                        <img
                          src={item.image ? `/images/${item.image}` : "/logo.png"}
                          alt={itemName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/logo.png";
                          }}
                        />
                        {/* Fade to card bg */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, var(--bg-card) 0%, transparent 50%)",
                          }}
                        />

                        {/* Featured Badge */}
                        <div
                          className="absolute top-4 right-4 flex items-center gap-1"
                          style={{
                            background: "var(--brand-gold)",
                            color: "var(--brand-dark)",
                            padding: "6px 12px",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 800,
                            fontSize: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
                          }}
                        >
                          <HiStar size={14} />
                          <span>{t("menu.featured") || "مميز"}</span>
                        </div>

                        {/* Sold Out Badge */}
                        {unavailable && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.60)" }}
                          >
                            <span className="font-black text-white text-xl tracking-widest border-2 border-white px-4 py-2 rounded-lg rotate-12">
                              {t("menu.sold_out") || "نفذت الكمية"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div
                        className="flex flex-col flex-1 p-6 z-10"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <div className="flex-1">
                          <h3
                            className="font-semibold text-2xl leading-tight mb-2 text-right"
                            style={{ color: "var(--text-primary)", fontFamily: "Alexandria", fontWeight: 600 }}
                          >
                            {itemName}
                          </h3>
                          {description && (
                            <p
                              className="text-right line-clamp-3 font-medium"
                              style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, fontFamily: "Cairo", fontWeight: 500 }}
                            >
                              {description}
                            </p>
                          )}
                        </div>

                        {/* Footer / Actions */}
                        <div
                          className="flex items-center justify-between mt-4 pt-4"
                          style={{ borderTop: "1px solid var(--border-light)" }}
                        >
                          <div
                            className="flex flex-wrap items-baseline gap-1 font-black"
                            style={{ color: "var(--brand-red)" }}
                          >
                            {prices.map((price, idx) => (
                              <div
                                key={idx}
                                className={`flex items-baseline gap-0.5 font-black ${prices.length > 1 ? "text-[14px]" : "text-[22px]"} leading-none`}
                                style={{ fontFamily: "Cairo" }}
                              >
                                <span className="text-[11px] font-bold opacity-70">₪</span>
                                {price}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            {/* Details button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (unavailable) return;
                                onDetailsClick?.(item);
                                onClose();
                              }}
                              className="flex items-center justify-center transition-all duration-200"
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "var(--radius-full)",
                                background: "var(--bg-surface)",
                                border: "1.5px solid var(--border-light)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                transition: "all var(--transition)",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-gold)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-gold)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-dark)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-light)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                              }}
                            >
                              <FiInfo size={20} />
                            </button>

                            {/* Add to order button */}
                            {canOrder && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onItemClick?.(item);
                                  onClose();
                                }}
                                className="flex items-center justify-center transition-all duration-200"
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  borderRadius: "var(--radius-full)",
                                  background: "var(--brand-red)",
                                  color: "white",
                                  border: "none",
                                  boxShadow: "var(--shadow-button)",
                                  cursor: "pointer",
                                  transition: "all var(--transition)",
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red-dark)";
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                                }}
                              >
                                <FiShoppingCart size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{ minHeight: "300px" }}
                >
                  <div style={{ fontSize: "64px", opacity: 0.2 }}>🌟</div>
                  <p className="mt-4 font-bold text-white text-lg">
                    {t("menu.no_featured") || "لا توجد أصناف مميزة حالياً"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}