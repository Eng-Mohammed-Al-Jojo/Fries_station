import React, { useCallback, useMemo } from "react";
import { type Item } from "./Menu";
import { FiShoppingCart } from "react-icons/fi";
import { HiStar } from "react-icons/hi";

interface Props {
  item: Item;
  orderSystem: boolean;
  onClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
  index?: number;
}

/**
 * ItemRow — Fries Station Search Results Layout
 *
 * Alternating editorial layout used for search results in Menu.tsx.
 * Uses unified brand color tokens exclusively.
 */
const ItemRow = React.memo(({ item, orderSystem, onClick, onDetailsClick, index = 0 }: Props) => {
  const prices = useMemo(
    () => String(item.price).split(",").map((p) => p.trim()).filter(Boolean),
    [item.price]
  );
  const unavailable = item.visible === false;
  const itemName = item.nameAr || item.name || "";
  const description = item.ingredientsAr || item.ingredients || "";
  const canOrder = !unavailable && orderSystem;
  const isFeatured = item.star || (item as any).isFeatured;
  const isEven = index % 2 === 0;

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
      className={`group flex items-center w-full relative mb-2 md:mb-4
        ${isEven ? "flex-row" : "flex-row-reverse"}
        ${unavailable ? "opacity-55 cursor-not-allowed" : "cursor-pointer"}`}
      role="button"
      aria-label={itemName}
      tabIndex={unavailable ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as any);
      }}
    >
      {/* ─── Image (floating, overlapping) ─── */}
      <div
        className={`relative shrink-0 z-10
          w-[100px] h-[100px] md:w-[104px] md:h-[104px] lg:w-[116px] lg:h-[116px]
          transition-transform duration-300 transform-gpu will-change-transform
          ${isEven
            ? "me-[-18px] md:me-[-22px] lg:me-[-28px]"
            : "ms-[-18px] md:ms-[-22px] lg:ms-[-28px]"
          }`}
        aria-hidden="true"
      >
        <div
          className={`w-full h-full block transition-all duration-300 rounded-[22px] border-2 overflow-hidden
            ${!unavailable
              ? "border-[var(--brand-gold)] shadow-[0_4px_12px_var(--red-a06)] group-hover:shadow-[0_14px_32px_var(--red-a22)]"
              : "grayscale-[50%] border-[var(--border-light)]"
            }`}
        >
          <img
            className={`w-full h-full object-cover block transition-transform duration-300 transform-gpu
              ${!unavailable ? "group-hover:scale-[1.08]" : ""}`}
            src={item.image ? `/images/${item.image}` : "/logo.png"}
            alt={itemName}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/logo.png";
            }}
          />
          {unavailable && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
              aria-hidden="true"
            >
              <span className="text-white text-[11px] font-extrabold tracking-[0.06em] drop-shadow-md">
                نفذت
              </span>
            </div>
          )}
        </div>

        {/* Featured Sticker */}
        {isFeatured && !unavailable && (
          <div
            className="absolute top-[-6px] start-[-6px] lg:top-[-8px] lg:start-[-8px]
              w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] rounded-full
              border-2 border-[var(--bg-card)]
              shadow-[0_4px_10px_var(--red-a18)]
              z-20 flex items-center justify-center
              bg-[var(--brand-gold)]
              transition-transform duration-300
              group-hover:scale-110 group-hover:rotate-12"
            aria-label="مميز"
          >
            <HiStar className="text-[10px] lg:text-[12px] text-[var(--brand-dark)]" />
          </div>
        )}
      </div>

      {/* ─── Content Card ─── */}
      <div
        className={`relative grow min-h-[94px] rounded-[22px] flex flex-col justify-center
          overflow-hidden z-0 transition-all duration-300 transform-gpu
          py-[12px] md:py-[16px]
          ${unavailable
            ? "bg-[var(--bg-surface)] border border-[var(--border-light)]"
            : "bg-[var(--bg-card)] border border-[var(--border-light)] shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-floating)] group-hover:border-[var(--border-base)] group-hover:-translate-y-0.5"
          }
          ${isEven
            ? "ps-[28px] pe-[12px] md:ps-[36px] md:pe-[16px] lg:ps-[46px] lg:pe-[20px]"
            : "pe-[28px] ps-[12px] md:pe-[36px] md:ps-[16px] lg:pe-[46px] lg:ps-[20px]"
          }`}
      >
        {/* Gold-to-red accent bar */}
        <div
          className={`absolute top-[16px] bottom-[16px] w-[3.5px] rounded-full
            bg-gradient-to-b from-[var(--brand-gold)] to-[var(--brand-red)]
            transition-opacity duration-300
            ${isEven ? "start-0" : "end-0"}`}
        />

        <div className="flex flex-row items-center justify-between gap-[14px] text-start w-full">
          {/* Title & Ingredients */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="font-extrabold leading-snug truncate text-[clamp(15px,4vw,17px)] text-[var(--text-primary)] m-0">
              {itemName}
            </h3>
            {description && (
              <p className="line-clamp-2 leading-relaxed text-[clamp(11px,2.8vw,12px)] text-[var(--text-muted)] font-medium m-0">
                {description}
              </p>
            )}
          </div>

          {/* Price & Cart */}
          <div className="flex flex-col items-center shrink-0 pl-1 gap-2">
            <div
              className={`flex flex-wrap items-baseline justify-center gap-0.5
                ${unavailable ? "text-[var(--text-muted)] line-through" : "text-[var(--brand-red)]"}`}
            >
              {prices.map((price, idx) => (
                <div
                  key={idx}
                  className={`flex items-baseline gap-0.5 font-black ${prices.length > 1 ? "text-[15px]" : "text-[18px]"} leading-none`}
                >
                  <span className="text-[11px] font-bold opacity-70">₪</span>
                  {price}
                </div>
              ))}
            </div>

            {canOrder && (
              <button
                onClick={handleClick}
                aria-label={`أضف ${itemName} للطلب`}
                className="flex items-center justify-center shrink-0 w-[36px] h-[36px]
                  rounded-full bg-[var(--brand-red)] text-white
                  shadow-[0_4px_12px_var(--red-a30)]
                  border-none transition-all duration-200 transform-gpu cursor-pointer
                  hover:bg-[var(--brand-gold)] hover:scale-110
                  hover:text-[var(--brand-dark)]
                  hover:shadow-[var(--shadow-gold)]
                  active:scale-95"
              >
                <FiShoppingCart size={16} />
              </button>
            )}

            {unavailable && (
              <span
                className="font-bold whitespace-nowrap text-[9px] px-[9px] py-[3px]
                  rounded-full bg-[var(--red-a06)] text-[var(--brand-red)]
                  border border-[var(--red-a12)] tracking-[0.02em]"
              >
                نفذت
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ItemRow.displayName = "ItemRow";
export default ItemRow;
