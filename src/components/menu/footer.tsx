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
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--brand-red)",
        paddingTop: "0",
        paddingBottom: "44px",
        marginTop: "40px",
      }}
      aria-label="Footer"
    >
      {/* ── SVG Wave divider (Cream to Red transition) ── */}
      <div
        className="relative w-full pointer-events-none"
        style={{ height: "60px", marginBottom: "40px", transform: "rotate(180deg)" }}
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

      {/* Watermark pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/pattern.png')", // Assume there's a pattern or we can just use CSS
          opacity: 0.05,
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Fries Station"
          style={{
            width: "130px",
            height: "130px",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(245,197,24,0.40)) brightness(1.1)",
          }}
        />

        {/* Contact row */}
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: "20px", fontSize: "13px", fontWeight: 600 }}
        >
          {footer.address && (
            <div
              className="flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              <FaMapMarkerAlt style={{ color: "var(--brand-gold)" }} />
              <span>{footer.address}</span>
            </div>
          )}

          {footer.phone && (
            <a
              href={`tel:${footer.phone}`}
              className="flex items-center gap-2"
              style={{
                color: "rgba(255,255,255,0.80)",
                textDecoration: "none",
                transition: "color var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.80)";
              }}
            >
              <FaPhoneAlt style={{ color: "var(--brand-gold)" }} />
              <span>{footer.phone}</span>
            </a>
          )}

          {/* Payment methods button */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2"
            style={{
              color: "rgba(255,255,255,0.80)",
              cursor: "pointer",
              background: "none",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "IBM Plex Sans Arabic",
              transition: "color var(--transition)",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-gold)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.80)";
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(245,197,24,0.20)",
                color: "var(--brand-gold)",
              }}
            >
              <FiCreditCard size={13} />
            </div>
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 800,
              }}
            >
              طرق الدفع
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(245,197,24,0.20)",
          }}
          aria-hidden="true"
        />

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
                className="flex items-center justify-center relative overflow-hidden group"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(245,197,24,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  transition: "all var(--transition)",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--brand-gold)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--brand-dark)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px) scale(1.05)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--brand-gold)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(245,197,24,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,197,24,0.15)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <Icon size={18} style={{ position: "relative", zIndex: 2 }} />
              </a>
            ) : null
          )}
        </div>

        {/* Developer signature */}
        <div
          className="flex flex-col items-center gap-3"
          style={{
            paddingTop: "20px",
            borderTop: "1px solid rgba(245,197,24,0.15)",
            width: "100%",
          }}
        >
          <a
            href="https://engmohammedaljojo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 group"
            style={{
              textDecoration: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.05)",
              transition: "all var(--transition)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.25)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,197,24,0.3)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              <FaLaptopCode size={14} />
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                {t("footer.developed_by")}
              </span>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "var(--brand-gold)",
                fontFamily: "var(--font-brand, inherit)",
                letterSpacing: "0.05em",
              }}
            >
              Eng. Mohammed El joujo
            </span>
          </a>

          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.40)",
            }}
          >
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
