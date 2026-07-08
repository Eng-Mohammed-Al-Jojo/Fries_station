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
      <div className="flex items-center gap-3" style={{ paddingInline: "4px", paddingBlockEnd: "4px" }}>
        {/* Red bar accent */}
        <div
          style={{
            width: "6px",
            height: "38px",
            borderRadius: "var(--radius-full)",
            background: "var(--brand-red)",
            boxShadow: "0 5px 14px rgba(200,16,46,0.34)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <h2
          className="font-bold leading-tight"
          style={{
            fontSize: "clamp(20px, 5vw, 28px)",
            color: "var(--text-primary)",
            textShadow: "0 1px 0 rgba(255,255,255,0.42)",
          }}
        >
          {catName}
        </h2>
        {/* Gold accent dot */}
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(200,16,46,0.34), transparent)" }}
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
                style={{ background: "rgba(200,16,46,0.24)" }}
                aria-hidden="true"
              />
              <span
                className="font-semibold whitespace-nowrap"
                style={{
                  fontSize: "12px",
                  paddingBlock: "5px",
                  paddingInline: "16px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255,253,242,0.86)",
                  color: "var(--brand-red)",
                  border: "1px solid rgba(200,16,46,0.22)",
                  boxShadow: "0 6px 18px rgba(227,169,0,0.16)",
                  letterSpacing: "0",
                  textTransform: "uppercase",
                }}
              >
                {sub.nameAr}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(200,16,46,0.24)" }}
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
