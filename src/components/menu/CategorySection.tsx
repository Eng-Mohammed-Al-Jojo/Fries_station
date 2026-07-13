import { useMemo } from "react";
import ItemCard from "./ItemCard";
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
      className="w-full flex flex-col gap-6 pb-4 transform-gpu"
    >
      {/* ── Premium Category Header ── */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-3">
          {/* Diamond ornament */}
          <span
            className="font-bold select-none shrink-0"
            style={{ fontSize: "20px", color: "var(--brand-gold)" }}
            aria-hidden="true"
          >
            ✦
          </span>

          <h2
            className="font-extrabold leading-tight text-right"
            style={{
              fontSize: "clamp(22px, 5.5vw, 30px)",
              color: "var(--brand-red)",
              fontFamily: "Alexandria, sans-serif",
              fontWeight: 600,
            }}
          >
            {catName}
          </h2>

          {/* Decorative trailing line */}
          <div className="flex-1 flex items-center gap-1.5" aria-hidden="true">
            <div
              className="h-[1.5px] flex-grow rounded-full opacity-50"
              style={{ background: "linear-gradient(to left, var(--brand-gold), transparent)" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 opacity-75"
              style={{ background: "var(--brand-gold)" }}
            />
          </div>
        </div>

        {/* Gold underline accent */}
        <div
          className="h-[2px] rounded-full opacity-55"
          style={{ width: "40px", marginInlineStart: "28px", background: "var(--brand-gold)" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Items Grid ── */}
      <div className="flex flex-col gap-6">
        {/* Main items (no subcategory) */}
        {groupedItems.noSubItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {groupedItems.noSubItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                orderSystem={orderSystem}
                onClick={onItemClick}
                onDetailsClick={onDetailsClick}
              />
            ))}
          </div>
        )}

        {/* Subcategories */}
        {activeSubcategories.map((sub) => (
          <div key={sub.id} className="flex flex-col gap-4">
            {/* Subcategory divider */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-px rounded-full"
                style={{ background: "rgba(212,10,37,0.14)" }}
                aria-hidden="true"
              />
              <span
                className="font-bold whitespace-nowrap shrink-0"
                style={{
                  fontSize: "11px",
                  paddingBlock: "6px",
                  paddingInline: "18px",
                  borderRadius: "999px",
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
                className="flex-1 h-px rounded-full"
                style={{ background: "rgba(212,10,37,0.14)" }}
                aria-hidden="true"
              />
            </div>

            {/* Sub-items grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {groupedItems.groups[sub.id].map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  orderSystem={orderSystem}
                  onClick={onItemClick}
                  onDetailsClick={onDetailsClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
