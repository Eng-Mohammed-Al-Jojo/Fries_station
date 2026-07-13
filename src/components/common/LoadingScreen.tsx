import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  onExited?: () => void;
}

export default function LoadingScreen({ visible, onExited }: Props) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          dir={isRtl ? "rtl" : "ltr"}
          style={{ background: "var(--brand-red)" }}
        >
          {/* Watermark pattern overlay */}
          <div
            className="absolute inset-0 hero-watermark pointer-events-none"
            aria-hidden="true"
          />

          {/* Radial glow behind logo */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,210,46,0.32) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo ring container */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: "2px solid rgba(255,210,46,0.22)",
                  borderTopColor: "var(--brand-gold)",
                }}
              />

              {/* Inner reverse ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="absolute inset-5 rounded-full pointer-events-none"
                style={{
                  border: "1.5px dashed rgba(255,210,46,0.18)",
                }}
              />

              {/* Gold glow disk */}
              <div
                className="absolute inset-8 rounded-full"
                style={{ background: "rgba(255,210,46,0.10)", filter: "blur(12px)" }}
              />

              {/* Logo */}
              <motion.img
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src="/logo.png"
                alt="Fries Station"
                className="relative w-28 h-28 object-contain drop-shadow-2xl z-10"
                style={{ filter: "drop-shadow(0 4px 20px rgba(255,210,46,0.42))" }}
              />
            </div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <p
                className="text-lg font-bold tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.25em" }}
              >
                {isRtl ? "من هنا تبدأ المتعة " : "Preparing..."}
              </p>

              {/* Animated gold dots */}
              <div className="flex gap-2.5">
                {[0, 0.18, 0.36].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay,
                      ease: "easeInOut",
                    }}
                    className="block w-2.5 h-2.5 rounded-full"
                    style={{ background: "var(--brand-gold)" }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Wave divider at bottom transitioning to cream */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
            <svg
              viewBox="0 0 1440 90"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full"
              style={{ display: "block", height: "90px" }}
            >
              <path
                d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,90 L0,90 Z"
                fill="var(--bg-main)"
                fillOpacity="0.18"
              />
            </svg>
          </div>

          {/* Branding tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-6 text-[10px] font-bold uppercase tracking-[0.5em]"
            style={{ color: "rgba(255,210,46,0.55)" }}
          >
            Fries Station
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
