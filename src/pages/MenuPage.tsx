import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu, { type Item } from "../components/menu/Menu";
import ItemModal from "../components/menu/ItemModal";
import ItemDetailsDrawer from "../components/menu/ItemDetailsDrawer";
import { HiSparkles } from "react-icons/hi";
import FeaturedModal from "../components/menu/FeaturedModal";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion } from "framer-motion";
import { FirebaseService } from "../services/firebaseService";
import OrderStatusButton from "../components/cart/OrderStatusButton";

export default function MenuPage() {
  const { t } = useTranslation();

  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [hasFeatured, setHasFeatured] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<Item | null>(null);
  const [orderSystem, setOrderSystem] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseService.listen("settings/orderSystem", (value) => {
      setOrderSystem(value ?? true);
    });
    return () => unsubscribe();
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) setIsDataReady(true);
  }, []);

  const handleFeaturedCheck = useCallback((has: boolean) => {
    setHasFeatured(has);
  }, []);

  const handleFeaturedItemsChange = useCallback((items: Item[]) => {
    setFeaturedItems(items);
  }, []);

  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleDetailsClick = useCallback((item: Item) => {
    setSelectedDetailsItem(item);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col menu-wrapper overflow-x-hidden"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      {/* Loading Screen */}
      <LoadingScreen visible={isLoading} />

      {/* Featured Button — Floating */}
      <div className="absolute top-4 left-4 z-50">
        {isDataReady && hasFeatured && (
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => setShowFeaturedModal(true)}
              aria-label={t("menu.featured_items")}
              className="flex items-center gap-2 relative group"
              style={{
                background: "var(--brand-red)",
                border: "2px solid var(--brand-gold)",
                borderRadius: "var(--radius-full)",
                padding: "8px 16px",
                color: "white",
                boxShadow: "0 8px 24px rgba(200,16,46,0.3)",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05, y: -2, boxShadow: "0 12px 32px rgba(200,16,46,0.4)" }}
              whileTap={{ scale: 0.95, y: 1 }}
            >
              <HiSparkles size={18} color="var(--brand-gold)" />
              <span className="hidden sm:inline">{t("menu.featured_items")}</span>

              {/* Notification Badge */}
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center"
                style={{
                  background: "var(--brand-gold)",
                  color: "var(--brand-dark)",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  fontSize: "10px",
                  fontWeight: 900,
                  border: "2px solid var(--brand-red)",
                }}
              >
                !
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>

      <main className="flex flex-col flex-1">

        {/* ═══════════════════════════════════════
            PREMIUM HERO — Deep Red × Gold Accent
            ═══════════════════════════════════════ */}
        <section
          className="relative flex flex-col items-center justify-center text-center overflow-hidden"
          style={{ background: "var(--brand-red)", paddingTop: "56px", paddingBottom: "0" }}
          aria-label="Hero section"
        >
          {/* Watermark pattern overlay */}
          <div
            className="absolute inset-0 hero-watermark pointer-events-none"
            aria-hidden="true"
          />

          {/* Radial gold glow */}
          <motion.div
            animate={{ opacity: [0.20, 0.38, 0.20], scale: [1, 1.06, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none transform-gpu"
            style={{
              background: "radial-gradient(circle, rgba(255,210,46,0.28) 0%, transparent 68%)",
            }}
          />

          {/* Logo — floating */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
            style={{ paddingBottom: "0" }}
          >
            {/* Gold halo ring */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: "180px", height: "180px" }}
            >
              {/* Outer halo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full pointer-events-none transform-gpu will-change-transform"
                style={{ border: "1.5px solid rgba(255,210,46,0.22)", borderTopColor: "rgba(255,210,46,0.7)" }}
              />
              {/* Inner subtle ring */}
              <div
                className="absolute inset-3 rounded-full pointer-events-none"
                style={{ border: "1px dashed rgba(245,197,24,0.15)" }}
              />
              {/* Gold glow disk */}
              <div
                className="absolute inset-6 rounded-full pointer-events-none"
                style={{ background: "rgba(245,197,24,0.10)", filter: "blur(10px)" }}
              />

              {/* Logo image */}
              <motion.img
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.18, ease: "backOut" }}
                className="animate-brandFloat relative z-10 object-contain"
                style={{
                  width: "130px",
                  height: "130px",
                  filter: "drop-shadow(0 6px 24px rgba(245,197,24,0.50))",
                }}
                src="/logo.png"
                alt="Fries Station Logo"
              />
            </div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="mt-6 flex flex-col items-center gap-1 z-10"
            >
              {/* Italic serif accent */}
              <span
                className="text-base italic font-medium"
                style={{
                  color: "var(--brand-gold)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "0.04em",
                  opacity: 0.9,
                }}
              >
                Delicious
              </span>

              {/* Main title */}
              <h1
                className="text-5xl md:text-6xl font-black leading-none tracking-tight"
                style={{ color: "var(--brand-gold)" }}
              >
                Menu
              </h1>

              {/* Arabic subtitle */}
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.06em" }}
              >
                {t("menu.title") || "من هنا تبدأ المتعة"}
              </p>
            </motion.div>
          </motion.div>

          {/* ── SVG Wave divider ── */}
          {/* Creates the smooth transition from red hero → cream content */}
          <div
            className="relative w-full pointer-events-none"
            style={{ marginTop: "32px", height: "80px", overflow: "hidden" }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <path
                d="M0,30 C360,75 1080,0 1440,40 L1440,80 L0,80 Z"
                fill="var(--bg-main)"
              />
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════
            MENU CONTENT — Cream area
            ═══════════════════════════ */}

        <div
          className="flex-1 w-full max-w-6xl mx-auto px-0 md:px-6 pb-28"
          style={{ marginTop: "-1px" }} /* flush against wave */
        >

          <Menu
            onLoadingChange={handleLoadingChange}
            onFeaturedCheck={handleFeaturedCheck}
            onFeaturedItemsChange={handleFeaturedItemsChange}
            onItemClick={handleItemClick}
            onDetailsClick={handleDetailsClick}
          />
        </div>

      </main>

      {/* Floating Cart */}
      {isDataReady && (
        <div className="fixed bottom-6 right-6 z-50">
          <CartButton />
        </div>
      )}

      {/* Modals */}
      <FeaturedModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        orderSystem={orderSystem}
        items={featuredItems}
        onItemClick={setSelectedItem}
        onDetailsClick={setSelectedDetailsItem}
      />

      <ItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />

      <ItemDetailsDrawer
        isOpen={!!selectedDetailsItem}
        onClose={() => setSelectedDetailsItem(null)}
        item={selectedDetailsItem}
        orderSystem={orderSystem}
      />

      <OrderStatusButton />
      <Footer />
    </div>
  );
}