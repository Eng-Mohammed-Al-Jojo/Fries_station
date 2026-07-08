import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Category } from "./Menu";
import { FaThLarge } from "react-icons/fa";

interface Props {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryNavigation({ categories, activeId, onSelect }: Props) {
  const { t } = useTranslation();
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeId]);

  return (
    <div className="relative mb-2 sm:mb-2">
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2 min-w-max px-4 md:px-1">
          {/* "All" pill */}
          <Pill
            id="all"
            label={t("common.all") || "الكل"}
            isActive={activeId === "all"}
            onClick={() => onSelect("all")}
            isAll
            refProp={activeId === "all" ? activeRef : null}
          />

          {categories.map((cat) => (
            <Pill
              key={cat.id}
              id={cat.id}
              label={cat.nameAr || cat.name}
              isActive={activeId === cat.id}
              onClick={() => onSelect(cat.id)}
              refProp={activeId === cat.id ? activeRef : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Sub-component ─────────────────── */
interface PillProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isAll?: boolean;
  refProp?: React.Ref<HTMLButtonElement> | null;
}

function Pill({ label, isActive, onClick, isAll, refProp }: PillProps) {
  return (
    <button
      ref={refProp || null}
      onClick={onClick}
      aria-pressed={isActive}
      className="relative flex items-center gap-1 mt-1 whitespace-nowrap font-semibold text-sm overflow-hidden"
      style={{
        height: "42px",
        paddingInline: "20px",
        borderRadius: "var(--radius-full)",
        border: isActive
          ? "2px solid var(--brand-gold-deep)"
          : "1.5px solid var(--display-yellow-border)",
        background: isActive ? "var(--brand-gold)" : "var(--display-yellow-pale)",
        color: isActive ? "var(--brand-dark)" : "var(--text-secondary)",
        transition: "background var(--transition), color var(--transition), border-color var(--transition), box-shadow var(--transition)",
        boxShadow: isActive ? "0 8px 22px rgba(227,169,0,0.32)" : "0 5px 16px rgba(227,169,0,0.10)",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-gold-deep)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-red)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--display-yellow-border)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--brand-gold)";
        (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = "none";
      }}
    >
      {/* Active spring underline indicator */}
      {isActive && (
        <motion.div
          layoutId="pillActive"
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--brand-gold)", zIndex: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        />
      )}

      {/* Icon / dot */}
      <span className="relative z-10 flex items-center gap-2">
        {isAll ? (
          <FaThLarge size={13} />
        ) : (
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: isActive ? "var(--brand-dark)" : "var(--brand-red)" }}
          />
        )}
        {label}
      </span>
    </button>
  );
}
