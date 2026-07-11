import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import CategorySection from "./CategorySection";
import ItemRow from "./ItemRow";
import MenuSkeleton from "./MenuSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "react-icons/fi";
import { FaCommentDots } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";
import CategoryNavigation from "./CategoryNavigation";

import { MenuService } from "../../services/menuService";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

const categoryVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 }
};

/* ================= Types ================= */
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  available?: boolean;
  order?: number;
  image?: string;
  visible?: boolean;
}

export interface Subcategory {
  id: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  image?: string;
  visible?: boolean;
  order?: number;
}

export interface Item {
  featured: any;
  image: string | undefined;
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number;
  ingredients?: string;
  ingredientsAr?: string;
  ingredientsEn?: string;
  priceTw?: number;
  categoryId: string;
  subcategoryId?: string | null;
  visible?: boolean;
  star?: boolean;
  createdAt?: number;
  order?: number;
}

/* ================= Props ================= */
interface Props {
  onLoadingChange?: (loading: boolean) => void;
  onFeaturedCheck?: (hasFeatured: boolean) => void;
  onFeaturedItemsChange?: (items: Item[]) => void;
  orderSystem?: boolean;
  onItemClick?: (item: Item) => void;
  onDetailsClick?: (item: Item) => void;
}

type LoadingPhase = "loading" | "skeleton" | "ready";



export default function Menu({ onLoadingChange, onFeaturedCheck, onFeaturedItemsChange, orderSystem: initialOrderSystem, onItemClick, onDetailsClick }: Props) {
  const { t } = useTranslation();


  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [phase, setPhase] = useState<LoadingPhase>("loading");
  const [orderSystem, setOrderSystem] = useState<boolean>(initialOrderSystem ?? true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>("all");
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(3);

  const isMounted = useRef(true);
  const startTime = useRef(Date.now());
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ================= Data Fetching ================= */
  useEffect(() => {
    isMounted.current = true;
    onLoadingChange?.(true);

    let unsubscribe: (() => void) | null = null;

    const loadData = async () => {
      try {
        const { data } = await MenuService.getMenuWithFallback();
        if (!isMounted.current) return;

        setCategories(data.categories);
        setSubcategories(data.subcategories);
        setItems(data.items);
        setOrderSystem(data.orderSystem);

        const availableWithItems = data.categories.filter((cat: any) =>
          cat.available && data.items.some((i: any) => i.categoryId === cat.id)
        );

        if (availableWithItems.length > 0 && (!activeCategoryId || activeCategoryId === "all")) {
          // Default is "all", which we handle in the UI, but if we need a specific first category:
          // setActiveCategoryId("all"); // Or the first one if "all" is disabled
        }

        const wasLoaded = sessionStorage.getItem("menu_orca_initial_load");
        const elapsed = Date.now() - startTime.current;
        const MIN_LOADING_TIME = 1500;
        const remainingFetchTime = wasLoaded ? 0 : Math.max(0, MIN_LOADING_TIME - elapsed);

        setTimeout(() => {
          if (!isMounted.current) return;
          onLoadingChange?.(false);
          setPhase("ready"); // Skip skeleton for an instant, clean transition
          sessionStorage.setItem("menu_orca_initial_load", "true");
        }, remainingFetchTime);

        unsubscribe = MenuService.subscribeToMenuUpdates((freshData) => {
          if (!isMounted.current) return;
          setCategories(freshData.categories);
          setSubcategories(freshData.subcategories);
          setItems(freshData.items);
          setOrderSystem(freshData.orderSystem);
        });
      } catch (err) {
        console.error("Menu load failed:", err);
        if (isMounted.current) {
          onLoadingChange?.(false);
          setPhase("ready");
        }
      }
    };

    loadData();
    return () => {
      isMounted.current = false;
      unsubscribe?.();
    };
  }, [onLoadingChange]);

  /* ================= Derived Data (Optimized) ================= */
  const featuredItems = useMemo(() =>
    items
      .filter(i => (i.star === true || (i as any).isFeatured === true))
      .sort((a, b) => {
        if (a.visible === false && b.visible !== false) return 1;
        if (a.visible !== false && b.visible === false) return -1;
        return (a.order ?? 0) - (b.order ?? 0);
      }),
    [items]
  );

  const availableCategories = useMemo(() => {
    return categories
      .filter(cat => {
        // Show category if it has at least one item, even if unavailable
        return items.some(i => i.categoryId === cat.id);
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories, items]);

  const filteredItems = useMemo(() => {
    const search = searchTerm?.toLowerCase() ?? "";
    if (!search) return [];
    return items
      .filter((item) => {
        const name = (item.nameAr || item.name || "").toLowerCase();
        const ingredients = (item.ingredientsAr || item.ingredients || "").toLowerCase();
        return name.includes(search) || ingredients.includes(search);
      })
      .sort((a, b) => {
        if (a.visible === false && b.visible !== false) return 1;
        if (a.visible !== false && b.visible === false) return -1;
        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [items, searchTerm]);

  /**
   * Pre-compute sorted items per category ONCE.
   * Previously, filter+sort ran inside JSX on every render for every visible
   * category — this was a major source of jank.
   */
  const itemsByCategory = useMemo(() => {
    const map: Record<string, Item[]> = {};
    availableCategories.forEach((cat) => {
      map[cat.id] = items
        .filter((i) => i.categoryId === cat.id)
        .sort((a, b) => {
          if (a.visible === false && b.visible !== false) return 1;
          if (a.visible !== false && b.visible === false) return -1;
          return (a.order ?? 0) - (b.order ?? 0);
        });
    });
    return map;
  }, [items, availableCategories]);

  /* ================= Progressive Loading ================= */
  useEffect(() => {
    if (activeCategoryId !== "all" && activeCategoryId !== null) return;
    if (visibleCategoriesCount >= availableCategories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small delay for smooth scroll feel
          setTimeout(() => {
            setVisibleCategoriesCount((prev) => Math.min(prev + 3, availableCategories.length));
          }, 100);
        }
      },
      { rootMargin: "500px", threshold: 0 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [visibleCategoriesCount, availableCategories?.length, activeCategoryId]);

  useEffect(() => {
    // Reset to initial count when returning to 'all'
    if (activeCategoryId === "all" || activeCategoryId === null) {
      setVisibleCategoriesCount(3);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    onFeaturedCheck?.(featuredItems.length > 0);
    onFeaturedItemsChange?.(featuredItems);
  }, [featuredItems, onFeaturedCheck, onFeaturedItemsChange]);

  const handleItemClick = useCallback((item: Item) => {
    onItemClick?.(item);
  }, [onItemClick]);

  const activeCategory = useMemo(() =>
    availableCategories.find(c => c.id === activeCategoryId),
    [availableCategories, activeCategoryId]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm("");
  }, []);

  /* ================= Phase: Loading ================= */
  if (phase === "loading") return null;

  /* ================= Phase: Skeleton ================= */
  if (phase === "skeleton") {
    return (
      <div className="menu-wrapper">
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="max-w-7xl mx-auto px-4 pb-32">
          <MenuSkeleton />
        </motion.div>
      </div>
    );
  }

  /* ================= Phase: Ready ================= */
  return (
    <div className="menu-wrapper bg-transparent min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 pb-24"
      >
        <div className="flex flex-col">
          {/* Header Area */}
          <div className="flex flex-col mb-8 gap-8">
            {/* Logo or Title Placeholder if needed */}

            {/* Search Bar */}
            <div className="w-full max-w-lg mx-auto relative px-4" style={{ isolation: "isolate" }}>
              <div
                className="absolute right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{ color: "var(--text-muted)", transition: "color var(--transition)" }}
              >
                <FiSearch size={19} />
              </div>
              <input
                type="text"
                placeholder={t('common.search') || "عن ماذا تبحث؟"}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full text-sm font-semibold outline-none"
                style={{
                  background: "var(--display-yellow-pale)",
                  border: "1.5px solid #FFD22E",
                  borderRadius: "var(--radius-full)",
                  padding: "13px 52px 13px 20px",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-card)",
                  transition: "border-color var(--transition), box-shadow var(--transition)",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--brand-red)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,210,46,0.32), var(--shadow-card)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--display-yellow-border)";
                  (e.target as HTMLInputElement).style.boxShadow = "var(--shadow-card)";
                }}
              />
              {searchTerm && (
                <button
                  onClick={handleSearchClear}
                  aria-label="مسح البحث"
                  className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center justify-center z-10"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(200,16,46,0.08)",
                    color: "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background var(--transition), color var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,16,46,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Premium Category Navigation */}
            {!searchTerm && (
              <CategoryNavigation
                categories={availableCategories}
                activeId={activeCategoryId}
                onSelect={setActiveCategoryId}
              />
            )}
          </div>

          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              {searchTerm ? (
                <motion.div
                  key="search"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col w-full gap-4"
                >
                  {filteredItems.map((item) => (
                    <ItemRow key={item.id} item={item} orderSystem={orderSystem} onClick={handleItemClick} onDetailsClick={onDetailsClick} />
                  ))}
                </motion.div>
              ) : availableCategories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-5xl mb-6">
                    🍽️
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{t('menu.empty_menu') || "القائمة قادمة قريباً"}</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      {t('menu.empty_menu_desc') || "نحن نقوم بتجهيز تشكيلتنا اللذيذة. يرجى التحقق مرة أخرى قريباً."}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategoryId}
                  variants={categoryVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-16 transform-gpu"
                >
                  {(activeCategoryId === "all" || !activeCategoryId) ? (
                    <>
                      {availableCategories.slice(0, visibleCategoriesCount).map((cat) => (
                        <CategorySection
                          key={cat.id}
                          category={cat}
                          subcategories={subcategories}
                          items={itemsByCategory[cat.id] ?? []}
                          orderSystem={orderSystem}
                          onItemClick={handleItemClick}
                          onDetailsClick={onDetailsClick}
                        />
                      ))}
                      {visibleCategoriesCount < availableCategories.length && (
                        <div ref={bottomRef} className="py-12 flex justify-center items-center" style={{ opacity: 0.65 }}>
                          <div
                            className="rounded-full"
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "3.5px solid rgba(200,16,46,0.20)",
                              borderTopColor: "var(--brand-red)",
                              animation: "spin 0.75s linear infinite",
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    activeCategory && (
                      <CategorySection
                        category={activeCategory}
                        subcategories={subcategories}
                        items={itemsByCategory[activeCategory.id] ?? []}
                        orderSystem={orderSystem}
                        onItemClick={handleItemClick}
                        onDetailsClick={onDetailsClick}
                      />
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Components */}
        <button
          onClick={() => setShowFeedbackModal(true)}
          aria-label="تقييم"
          className="fixed flex items-center justify-center z-40"
          style={{
            bottom: "25px",
            right: "28px",
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "var(--brand-red)",
            color: "white",
            border: "2px solid white",
            cursor: "pointer",
            boxShadow: "var(--shadow-button)",
            transition: "background var(--transition), transform var(--transition)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-600)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-red)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.94)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          }}
        >
          <FaCommentDots size={20} />
        </button>

        <FeedbackModal show={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} orderSystem={orderSystem} />
      </motion.div>
    </div>
  );
}
