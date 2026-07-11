import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useTranslation } from "react-i18next";
import { PaymentService } from "../../services/paymentService";
import type { PaymentMethod } from "../../types/payment";
import PaymentModal from "./PaymentModal";

const LOCAL_STORAGE_KEY = "footerInfo";

export default function Footer() {
  const { t } = useTranslation();

  const [footer, setFooter] = useState({
    address: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    telegram: "",
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(true);

  useEffect(() => {
    const unsubPayments = PaymentService.subscribeToPaymentMethods((methods) => {
      setPaymentMethods(methods);
      setIsPaymentLoading(false);
    });
    return () => unsubPayments();
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) setFooter(JSON.parse(localData));

    const footerRef = ref(db, "settings/footerInfo");
    const unsubFooter = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFooter(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    });

    return () => {
      unsubFooter();
    };
  }, []);

  const socialLinks: { Icon: any; url: string | undefined; label: string }[] = [
    {
      Icon: FaWhatsapp,
      url: footer.whatsapp ? `https://wa.me/${footer.whatsapp}` : undefined,
      label: "WhatsApp",
    },
    { Icon: FaInstagram, url: footer.instagram || undefined, label: "Instagram" },
    { Icon: FaFacebookF, url: footer.facebook || undefined, label: "Facebook" },
    { Icon: FaTiktok, url: footer.tiktok || undefined, label: "TikTok" },
    { Icon: FaTelegramPlane, url: footer.telegram || undefined, label: "Telegram" },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden bg-[var(--brand-red)] pt-0 pb-[44px] mt-[40px]"
      aria-label="Footer"
    >
      {/* Watermark pattern overlay */}
      <div
        className="absolute inset-0 hero-watermark pointer-events-none"
        aria-hidden="true"
      />
      {/* ── SVG Wave divider (Cream to Red transition) ── */}
      <div
        className="relative w-full pointer-events-none h-[60px] mb-[40px] rotate-180"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-full"
        >
          <path
            d="M0,30 C360,75 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--bg-main)"
          />
        </svg>
      </div>

      {/* Watermark pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 bg-[url('/pattern.png')] bg-[length:200px] bg-repeat"
        aria-hidden="true"
      />

      <div
        className="relative z-10 max-w-[720px] mx-auto flex flex-col items-center gap-7"
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Fries Station"
          className="w-[130px] h-[130px] object-contain drop-shadow-[0_4px_12px_rgba(255,210,46,0.40)] brightness-110"
        />

        {/* Contact row */}
        <div className="flex flex-wrap justify-center gap-5 text-[13px] font-semibold">
          {footer.address && (
            <div className="flex items-center gap-2 text-white/80">
              <FaMapMarkerAlt className="text-[var(--brand-gold)]" />
              <span>{footer.address}</span>
            </div>
          )}

          {footer.phone && (
            <a
              href={`tel:${footer.phone}`}
              className="flex items-center gap-2 text-white/80 no-underline transition-colors duration-300 hover:text-[var(--brand-gold)]"
            >
              <FaPhoneAlt className="text-[var(--brand-gold)]" />
              <span>{footer.phone}</span>
            </a>
          )}

          {/* Payment methods button */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="group flex items-center gap-3 bg-black/15 border border-white/10 px-4 py-2.5 rounded-[14px] cursor-pointer shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-black/25 hover:border-[#FFD22E]/40 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:scale-95"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#FFD22E]/20 to-transparent border border-[#FFD22E]/30 text-[#FFD22E]">
              <FiCreditCard size={15} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col items-start justify-center text-start">

              <span className="text-[13px] text-white tracking-[0.05em] font-extrabold leading-none">
                طرق الدفع
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--brand-gold)]/20" aria-hidden="true" />

        {/* Social icons */}
        <div className="flex gap-3">
          {socialLinks.map(({ Icon, url, label }) =>
            url ? (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center relative overflow-hidden group w-11 h-11 rounded-full bg-[#FFD22E] text-[var(--brand-red)] transition-all duration-300 no-underline shadow-[0_4px_12px_rgba(255,210,46,0.2)] hover:-translate-y-1 hover:scale-110 hover:shadow-[0_8px_24px_rgba(255,210,46,0.5)]"
              >
                <Icon size={18} className="relative z-[2]" />
              </a>
            ) : null
          )}
        </div>

        {/* Developer signature */}
        <div className="flex flex-col items-center gap-3 pt-5 border-t border-[var(--brand-gold)]/15 w-full">
          <a
            href="https://engmohammedaljojo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 group no-underline text-white py-2 px-4 rounded-lg bg-black/15 border border-white/5 transition-all duration-300 hover:bg-black/25 hover:border-[var(--brand-gold)]/30 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-white/60">
              <FaLaptopCode size={14} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                {t("footer.developed_by")}
              </span>
            </div>
            <span className="text-[14px] font-extrabold text-[var(--brand-gold)] font-[var(--font-brand,inherit)] tracking-[0.05em]">
              Eng. Mohammed El joujo
            </span>
          </a>

          <p className="text-[10px] font-semibold text-white/40">
            © {new Date().getFullYear()} {t("footer.rights_reserved")}
          </p>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        methods={paymentMethods}
        isLoading={isPaymentLoading}
      />
    </footer>
  );
}
