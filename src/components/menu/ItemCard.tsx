import React, { useCallback, useMemo } from "react";
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
 * ItemCard — Fries Station Premium Card Grid Layout
 *
 * Used inside the 2-col / 3-col responsive card grid in CategorySection.
 * Keeps equal heights via flex-col layout (image + content + button).
 * All colors sourced exclusively from the unified design token system.
 */
const ItemCard = React.memo(({ item, orderSystem, onClick, onDetailsClick }: Props) => {
  const prices = useMemo(
    () => String(item.price).split(",").map((p) => p.trim()).filter(Boolean),
    [item.price]
  );
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
    <article
      className={`group relative flex flex-col rounded-[22px] overflow-hidden h-full
        transition-all duration-300 transform-gpu
        ${unavailable
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-floating)]"
        }`}
      style={{
        background: "var(--bg-card)",
        border: "1.5px solid var(--border-light)",
        boxShadow: "var(--shadow-card)",
      }}
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-label={itemName}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as any);
      }}
    >
      {/* ─── Image ─── */}
      <div
        className="relative w-full overflow-hidden shrink-0"
        style={{ aspectRatio: "4 / 3" }}
        aria-hidden="true"
      >
        <img
          className={`w-full h-full object-cover block transition-transform duration-500 transform-gpu will-change-transform
            ${!unavailable ? "group-hover:scale-[1.07]" : "grayscale-[40%]"}`}
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={itemName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/logo.png";
          }}
        />

        {/* Bottom gradient — always present */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, var(--dark-a40) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />

        {/* Unavailable overlay */}
        {unavailable && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(1.5px)" }}
            aria-hidden="true"
          >
            <span
              className="font-extrabold tracking-widest"
              style={{
                fontSize: "11px",
                color: "white",
                padding: "4px 14px",
                borderRadius: "var(--radius-full)",
                background: "var(--red-a30)",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              نفذت
            </span>
          </div>
        )}

        {/* Featured badge — gold only, no #ffc000 */}
        {isFeatured && !unavailable && (
          <div
            className="absolute top-2.5 start-2.5 flex items-center justify-center
              transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 z-10"
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "var(--radius-full)",
              background: "var(--brand-gold)",
              border: "2px solid var(--bg-card)",
              boxShadow: "0 4px 12px var(--red-a22)",
            }}
            aria-label="مميز"
          >
            <HiStar style={{ fontSize: "12px", color: "var(--brand-dark)" }} />
          </div>
        )}

        {/* Gold border glow on hover */}
        {!unavailable && (
          <div
            className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100
              transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 2px var(--gold-a30)" }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Name */}
        <h3
          className="font-extrabold leading-snug line-clamp-2 text-start"
          style={{
            fontSize: "clamp(13px, 3.2vw, 12px)",
            color: "var(--text-primary)",
            fontFamily: "Alexandria",
            fontWeight: 600,

          }}
        >
          {itemName}
        </h3>

        {/* Ingredients */}
        {description && (
          <p
            className="line-clamp-2 leading-relaxed text-start flex-1"
            style={{
              fontSize: "clamp(10px, 2.4vw, 11px)",
              color: "var(--text-muted)",
              fontWeight: 500,
              fontFamily: "Cairo",
            }}
          >
            {description}
          </p>
        )}
        {!description && <div className="flex-1" aria-hidden="true" />}

        {/* ─── Price + Button row ─── */}
        <div
          className="flex items-center justify-between gap-2 pt-1"
          style={{ borderTop: "1px solid var(--border-light)" }}
        >
          {/* Price */}
          <div
            className={`flex flex-wrap items-baseline gap-0.5
              ${unavailable ? "line-through opacity-50" : ""}`}
            style={{ color: "var(--brand-red)" }}
          >
            {prices.map((price, idx) => (
              <div
                key={idx}
                className={`flex items-baseline gap-0.5 font-black
                  ${prices.length > 1 ? "text-[16px]" : "text-[17px]"} leading-none`}
              >
                <span className="text-[11px] font-bold opacity-70">₪</span>
                {price}
              </div>
            ))}
          </div>

          {/* Add button or unavailable tag */}
          {canOrder ? (
            <button
              onClick={handleClick}
              aria-label={`أضف ${itemName} للطلب`}
              className="flex items-center justify-center shrink-0
                transition-all duration-200 active:scale-90"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "var(--brand-red)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px var(--red-a30)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-gold)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-dark)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px var(--red-a30)";
              }}
            >
              <FiShoppingCart size={15} />
            </button>
          ) : unavailable ? (
            <span
              className="font-bold"
              style={{
                fontSize: "9px",
                paddingInline: "9px",
                paddingBlock: "3px",
                borderRadius: "var(--radius-full)",
                background: "var(--red-a06)",
                color: "var(--brand-red)",
                border: "1px solid var(--red-a12)",
                letterSpacing: "0.02em",
              }}
            >
              نفذت
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
});

ItemCard.displayName = "ItemCard";
export default ItemCard;
