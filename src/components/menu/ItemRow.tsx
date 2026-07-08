import React, { useCallback } from "react";
import { type Item } from "./Menu";
import { FiShoppingCart } from "react-icons/fi";
import { HiStar } from "react-icons/hi";

interface Props {
  item: Item;
  orderSystem: boolean;
  onClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

/**
 * ItemRow — Fries Station  •  Separated Layout Edition
 *
 * تصميم موحّد الاتجاه لكل الأصناف:
 *  - الصورة دائمًا في جهة البداية (Start) — تظهر يمين الصف في RTL.
 *  - المحتوى (الاسم + المكونات + السعر + زر الطلب) في بطاقة منفصلة تمامًا
 *    عن الصورة، بفاصل مسافة واضح + خط فاصل خفيف، بدل التراكب السابق.
 *  - لا يوجد أي تبديل بحسب index — كل الصفوف بنفس الشكل والاتجاه.
 */
const ItemRow = React.memo(({ item, orderSystem, onClick, onDetailsClick }: Props) => {
  const prices = String(item.price).split(",").map((p) => p.trim()).filter(Boolean);
  const unavailable = item.visible === false;
  const itemName = item.nameAr || item.name || "";
  const description = item.ingredientsAr || item.ingredients || "";
  const canOrder = !unavailable && orderSystem;
  const isFeatured = item.star || (item as any).isFeatured;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (unavailable) return;
      if (orderSystem) {
        onClick?.(item);
      } else {
        onDetailsClick?.(item);
      }
    },
    [unavailable, orderSystem, item, onClick, onDetailsClick]
  );

  return (
    <div
      className={["item-row-outer", unavailable ? "unavailable" : ""].filter(Boolean).join(" ")}
      role="button"
      aria-label={itemName}
      tabIndex={unavailable ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as any);
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        gap: "6px",
        cursor: unavailable ? "not-allowed" : "pointer",
        background: "transparent"

      }}
    >
      {/* ─── الصورة: عنصر مستقل قائم بذاته ─── */}
      <div
        className="item-image-container relative"
        aria-hidden="true"
        style={{
          position: "relative",
          flexShrink: 0,
          width: "clamp(78px, 22vw, 96px)",
          height: "clamp(78px, 22vw, 96px)",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(200,16,46,0.16)",
        }}
      >
        <img
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={itemName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/logo.png";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {unavailable && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(200,16,46,0.48)" }}
            aria-hidden="true"
          >
            <span
              style={{
                color: "white",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              نفذت
            </span>
          </div>
        )}

        {isFeatured && !unavailable && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: "-6px",
              insetInlineEnd: "-6px",
              width: "24px",
              height: "24px",
              borderRadius: "var(--radius-full)",
              background: "var(--brand-gold)",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(200,16,46,0.30)",
              zIndex: 2,
            }}
            aria-label="مميز"
          >
            <HiStar size={12} color="var(--brand-dark)" />
          </div>
        )}
      </div>

      {/* ─── فاصل عمودي خفيف يبعد الصورة عن المحتوى بصريًا ─── */}
      <div
        aria-hidden="true"
        style={{
          width: "1px",
          alignSelf: "stretch",
          background:
            "linear-gradient(to bottom, transparent, rgba(200,16,46,0.18) 20%, rgba(200,16,46,0.18) 80%, transparent)",
        }}
      />

      {/* ─── بطاقة المحتوى: عمودان — (اسم + مكونات) مقابل (سعر + زر) ─── */}
      <div
        className="item-card"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          textAlign: "start",
          paddingRight: "12px",
          border: "1.5px solid rgba(255, 209, 3, 0.94)",

        }}
      >
        {/* ─── العمود الأول: اسم الصنف وأسفله المكونات ─── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            paddingRight: "6px",

          }}
        >
          <h3
            className="font-bold leading-snug truncate"
            style={{
              fontSize: "clamp(14px, 3.8vw, 17px)",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {itemName}
          </h3>
          {description && (
            <p
              className="line-clamp-2 leading-relaxed"
              style={{
                fontSize: "clamp(10px, 2.6vw, 12px)",
                color: "var(--text-muted)",
                fontWeight: 500,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* ─── العمود الثاني: السعر وأسفله زر الطلب (إن كان مفعّلًا) ─── */}
        <div
          className="flex flex-col items-center shrink-0 pl-3"
          style={{ gap: "10px" }}
        >
          <div
            className="flex flex-wrap items-baseline justify-center gap-1"
            style={{
              color: unavailable ? "var(--text-muted)" : "var(--brand-red)",
              textDecoration: unavailable ? "line-through" : "none",
            }}
          >
            {prices.map((price, idx) => (
              <div
                key={idx}
                className="flex items-baseline gap-0.5 font-black"
                style={{
                  fontSize: prices.length > 1 ? "15px" : "17px",
                  lineHeight: 1,
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, opacity: 0.7 }}>&#8362;</span>
                {price}
              </div>
            ))}
          </div>

          {canOrder && (
            <button
              onClick={handleClick}
              aria-label={`أضف ${itemName} للطلب`}
              className="flex items-center justify-center shrink-0"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-full)",
                background: "var(--brand-red)",
                color: "white",
                boxShadow: "var(--shadow-button)",
                border: "none",
                transition:
                  "background var(--transition), transform var(--transition), color var(--transition), box-shadow var(--transition)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "var(--brand-gold)";
                btn.style.transform = "scale(1.10)";
                btn.style.color = "var(--brand-dark)";
                btn.style.boxShadow = "0 8px 24px rgba(245,197,24,0.40)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "var(--brand-red)";
                btn.style.transform = "scale(1)";
                btn.style.color = "white";
                btn.style.boxShadow = "var(--shadow-button)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.10)";
              }}
            >
              <FiShoppingCart size={16} />
            </button>
          )}

          {unavailable && (
            <span
              className="font-bold whitespace-nowrap"
              style={{
                fontSize: "9px",
                padding: "3px 9px",
                borderRadius: "var(--radius-full)",
                background: "rgba(200,16,46,0.07)",
                color: "var(--brand-red)",
                border: "1px solid rgba(200,16,46,0.18)",
                letterSpacing: "0.05em",
              }}
            >
              نفذت الكمية
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ItemRow.displayName = "ItemRow";
export default ItemRow;
