import { useMemo } from "react";
import ItemRow from "./ItemRow";
import type { Category, Item, Subcategory } from "./Menu";

/**
 * CategorySection — Fries Station redesign
 *
 * Performance notes (preserved):
 *  • No framer-motion — avoids IntersectionObserver multiplication on large lists
 *  • Parent (Menu.tsx) pre-memoises per-category item arrays
 */
interface Props {
  category: Category;
  subcategories: Subcategory[];
  items: Item[];
  orderSystem: boolean;
  onItemClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

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
    <div className="w-full category-display-panel" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── Category Header ── */}
      <div className="flex items-center gap-3" style={{ paddingInline: "4px", paddingBlockEnd: "6px" }}>
        {/* Gradient accent bar */}
        <div
          style={{
            width: "6px",
            height: "38px",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(to bottom, var(--brand-gold), var(--brand-red))",
            boxShadow: "0 5px 16px rgba(200,16,46,0.28)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <h2
          className="font-black leading-tight"
          style={{
            fontSize: "clamp(20px, 5vw, 26px)",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {catName}
        </h2>
        {/* Fade-out line */}
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(200,16,46,0.28), transparent)" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Items ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Main (no-sub) items */}
        {groupedItems.noSubItems.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {groupedItems.noSubItems.map((item) => (
              <ItemRow
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
          <div key={sub.id} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Subcategory divider */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(227,169,0,0.32)" }}
                aria-hidden="true"
              />
              <span
                className="font-bold whitespace-nowrap"
                style={{
                  fontSize: "11px",
                  paddingBlock: "5px",
                  paddingInline: "14px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--display-yellow-pale)",
                  color: "var(--brand-gold-deep)",
                  border: "1.5px solid rgba(227,169,0,0.32)",
                  boxShadow: "0 4px 12px rgba(227,169,0,0.20)",
                  letterSpacing: "0.04em",
                }}
              >
                {sub.nameAr}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(227,169,0,0.32)" }}
                aria-hidden="true"
              />
            </div>

            {/* Sub-items — index resets to 0 for each subcategory group */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {groupedItems.groups[sub.id].map((item) => (
                <ItemRow
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
    </div>
  );
}
