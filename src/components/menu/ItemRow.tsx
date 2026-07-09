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
 * ItemRow — Fries Station  •  Premium Unified Layout
 *
 * Architecture decisions:
 *  - Zero inline styles: every visual rule lives in index.css as a named class.
 *  - Image sizing via Flex: the wrapper is a flex-column container and the <img>
 *    uses `flex: 1` so it fills the parent height WITHOUT `height: 100%`.
 *    The parent height is driven by `align-items: stretch` on the outer row,
 *    guaranteeing image === card height at any content length.
 *  - Featured badge is a sibling of the image wrapper (NOT a child), so it is
 *    never inside `overflow: hidden` and is never clipped.
 *  - Hover/active states handled entirely by CSS (no onMouseEnter/Leave handlers).
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
    >
      {/* ─── Featured badge — lives OUTSIDE the overflow:hidden image wrapper ─── */}
      {isFeatured && !unavailable && (
        <div className="item-featured-badge" aria-label="مميز">
          <HiStar size={11} />
          <span>مميز</span>
        </div>
      )}

      {/* ─── Image wrapper: flex-column so img fills via flex:1 ─── */}
      <div className="item-image-wrapper" aria-hidden="true">
        <img
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={itemName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/logo.png";
          }}
          className="item-image"
        />

        {/* Sold-out overlay */}
        {unavailable && (
          <div className="item-sold-out-overlay" aria-hidden="true">
            <span className="item-sold-out-text">نفذت</span>
          </div>
        )}
      </div>

      {/* ─── Vertical separator ─── */}
      <div className="item-row-divider" aria-hidden="true" />

      {/* ─── Content card ─── */}
      <div className="item-card">
        {/* Left column: name + description */}
        <div className="item-info-col">
          <h3 className="item-name">{itemName}</h3>
          {description && (
            <p className="item-description">{description}</p>
          )}
        </div>

        {/* Right column: price + action */}
        <div className="item-action-col">
          <div className={["item-price", unavailable ? "price-unavailable" : ""].filter(Boolean).join(" ")}>
            {prices.map((price, idx) => (
              <div
                key={idx}
                className={["item-price-block", prices.length > 1 ? "price-multi" : "price-single"].join(" ")}
              >
                <span className="item-currency">&#8362;</span>
                {price}
              </div>
            ))}
          </div>

          {canOrder && (
            <button
              onClick={handleClick}
              aria-label={`أضف ${itemName} للطلب`}
              className="item-add-btn"
            >
              <FiShoppingCart size={16} />
            </button>
          )}

          {unavailable && (
            <span className="item-unavailable-badge">نفذت الكمية</span>
          )}
        </div>
      </div>
    </div>
  );
});

ItemRow.displayName = "ItemRow";
export default ItemRow;
