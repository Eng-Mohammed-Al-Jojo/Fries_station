import { useMemo } from "react";
import ItemRow from "./ItemRow";
import type { Category, Item, Subcategory } from "./Menu";
import { motion } from "framer-motion";

interface Props {
  category: Category;
  subcategories: Subcategory[];
  items: Item[];
  orderSystem: boolean;
  onItemClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

const revealVariants: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function CategorySection({
  category,
  subcategories,
  items,
  orderSystem,
  onItemClick,
  onDetailsClick,
}: Props) {
  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    const noSubItems: Item[] = [];

    items.forEach((item) => {
      const sub = subcategories.find((s) => s.id === item.subcategoryId);
      if (item.subcategoryId && sub && sub.visible !== false) {
        if (!groups[item.subcategoryId]) groups[item.subcategoryId] = [];
        groups[item.subcategoryId].push(item);
      } else {
        noSubItems.push(item);
      }
    });

    return { groups, noSubItems };
  }, [items, subcategories]);

  const activeSubcategories = useMemo(() => {
    return subcategories
      .filter(
        (sub) =>
          sub.categoryId === category.id &&
          sub.visible !== false &&
          groupedItems.groups[sub.id]
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [category.id, subcategories, groupedItems.groups]);

  const catName = category.nameAr || category.name || "";

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="w-full flex flex-col gap-8 pb-4 transform-gpu"
    >
      {/* ── Category Header Redesign ── */}
      <div className="flex flex-col gap-2 pr-1" style={{ paddingBlockEnd: "8px" }}>
        <div className="flex items-center gap-3">
          {/* Diamond Ornament */}
          <span className="text-[var(--brand-gold)] font-bold text-xl select-none" aria-hidden="true">✦</span>
          
          <h2
            className="font-extrabold leading-tight text-right"
            style={{
              fontSize: "clamp(22px, 5.5vw, 30px)",
              color: "var(--brand-red)",
              fontFamily: "IBM Plex Sans Arabic, sans-serif",
            }}
          >
            {catName}
          </h2>
          
          {/* Decorative line with dot */}
          <div className="flex-1 flex items-center gap-1.5" aria-hidden="true">
            <div className="h-[1.5px] bg-gradient-to-l from-[var(--brand-gold)] to-transparent flex-grow opacity-60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-gold)] shrink-0 opacity-80" />
          </div>
        </div>
        
        {/* Soft geometric accent block */}
        <div 
          className="h-[2px] bg-[var(--brand-gold)] rounded-full opacity-60" 
          style={{ width: "40px", marginInlineStart: "28px" }} 
          aria-hidden="true" 
        />
      </div>

      {/* ── Items ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* Main (no-sub) items */}
        {groupedItems.noSubItems.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {groupedItems.noSubItems.map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                orderSystem={orderSystem}
                onClick={onItemClick}
                onDetailsClick={onDetailsClick}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* Subcategories */}
        {activeSubcategories.map((sub) => (
          <div key={sub.id} style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>

            {/* Subcategory divider */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(212,10,37,0.14)" }}
                aria-hidden="true"
              />
              <span
                className="font-bold whitespace-nowrap"
                style={{
                  fontSize: "11px",
                  paddingBlock: "6px",
                  paddingInline: "18px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-card)",
                  color: "var(--brand-red)",
                  border: "1px solid rgba(212,10,37,0.12)",
                  boxShadow: "0 4px 12px rgba(212,10,37,0.03)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {sub.nameAr}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(212,10,37,0.14)" }}
                aria-hidden="true"
              />
            </div>

            {/* Sub-items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {groupedItems.groups[sub.id].map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  orderSystem={orderSystem}
                  onClick={onItemClick}
                  onDetailsClick={onDetailsClick}
                  index={idx}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
