import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "featured" | "theme";
  className?: string;
  title?: string;
}

export default function GlassButton({
  onClick,
  icon,
  label,
  variant = "primary",
  className = "",
  title,
}: Props) {
  const baseStyle: React.CSSProperties = {
    width: "46px",
    height: "46px",
    borderRadius: "var(--radius-md)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    cursor: "pointer",
    border: "1.5px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all var(--transition)",
    willChange: "transform",
    position: "relative",
    overflow: "hidden",
  };

  const variantStyle: Record<string, React.CSSProperties> = {
    primary: {
      background: "rgba(200,16,46,0.10)",
      color: "var(--brand-red)",
      borderColor: "rgba(200,16,46,0.20)",
    },
    secondary: {
      background: "rgba(26,10,10,0.10)",
      color: "var(--brand-dark)",
      borderColor: "rgba(26,10,10,0.20)",
    },
    featured: {
      background: "var(--bg-card)",
      color: "var(--brand-dark)",
      borderColor: "rgba(255,255,255,0.40)",
    },
    theme: {
      background: "var(--brand-red)",
      color: "white",
      borderColor: "rgba(255,255,255,0.20)",
      boxShadow: "var(--shadow-button)",
    },
  };

  const hoverStyle: Record<string, React.CSSProperties> = {
    primary: { background: "var(--brand-red)", color: "white", borderColor: "var(--brand-red)" },
    secondary: { background: "var(--brand-dark)", color: "white", borderColor: "var(--brand-dark)" },
    featured: { background: "var(--brand-gold)", color: "var(--brand-dark)", borderColor: "var(--brand-gold)" },
    theme: { background: "var(--color-primary-600)", color: "white" },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      aria-label={title || label}
      style={{ ...baseStyle, ...variantStyle[variant] }}
      className={className}
      onMouseEnter={(e) => {
        Object.assign((e.currentTarget as HTMLButtonElement).style, hoverStyle[variant]);
      }}
      onMouseLeave={(e) => {
        Object.assign((e.currentTarget as HTMLButtonElement).style, {
          ...baseStyle,
          ...variantStyle[variant],
        });
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{icon}</span>
      {label && (
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontWeight: 600,
            fontSize: "13px",
            display: "none",
          }}
          className="sm:inline"
        >
          {label}
        </span>
      )}
    </motion.button>
  );
}
