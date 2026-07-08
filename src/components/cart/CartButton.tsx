import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import CartModal from "./CartModal";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CartButtonProps {
  className?: string;
}

export default function CartButton({ className = "" }: CartButtonProps) {
  const { t, i18n } = useTranslation();
  const { totalItems, isFullTrackingOpen, setIsFullTrackingOpen } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isFullTrackingOpen) {
      setOpen(true);
    }
  }, [isFullTrackingOpen]);

  const handleCloseModal = () => {
    setOpen(false);
    if (isFullTrackingOpen) {
      setIsFullTrackingOpen(false);
    }
  };

  const isRtl = i18n.language === "ar";

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0.88, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 10 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpen(true)}
            aria-label={t("common.cart")}
            className={`fixed z-50 flex items-center gap-3 font-semibold ${className}`}
            style={{
              willChange: "transform, opacity",
              bottom: "28px",
              ...(isRtl ? { left: "28px" } : { right: "28px" }),
              paddingInline: "22px",
              height: "52px",
              borderRadius: "var(--radius-full)",
              background: "var(--brand-gold)",
              color: "var(--brand-dark)",
              boxShadow: "var(--shadow-floating)",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "background var(--transition), box-shadow var(--transition)",
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-gold-deep)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 16px 40px rgba(200,16,46,0.20)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-gold)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-floating)";
            }}
          >
            {/* Cart icon */}
            <div className="relative shrink-0">
              <FiShoppingCart size={20} />
              {/* Count badge */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute flex items-center justify-center font-black"
                  style={{
                    top: "-22px",
                    right: isRtl ? undefined : "-14px",
                    left: isRtl ? "-14px" : undefined,
                    width: "22px",
                    height: "22px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--brand-red)",
                    color: "white",
                    fontSize: "10px",
                    border: "2px solid var(--brand-gold)",
                    willChange: "transform, opacity",
                  } as React.CSSProperties}
                >
                  {totalItems}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Label */}
            <span className="hidden sm:inline-block">{t("common.cart")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {open && <CartModal isOpen={open} onClose={handleCloseModal} />}
      </AnimatePresence>
    </>
  );
}
