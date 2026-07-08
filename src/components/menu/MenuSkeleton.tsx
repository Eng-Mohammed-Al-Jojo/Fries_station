export default function MenuSkeleton() {
  const categories = [1, 2];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "100%",
        paddingTop: "8px",
      }}
    >
      {/* Search skeleton */}
      <div style={{ maxWidth: "520px", margin: "0 auto", width: "100%", padding: "0 16px" }}>
        <div
          className="skeleton-shimmer"
          style={{
            height: "50px",
            width: "100%",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--border-light)",
            background: "var(--bg-card)",
          }}
        />
      </div>

      {/* Category pills skeleton */}
      <div
        className="flex gap-2.5 overflow-hidden no-scrollbar"
        style={{ padding: "0 16px" }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer shrink-0"
            style={{
              height: "42px",
              width: "88px",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--border-light)",
              background: "var(--bg-card)",
            }}
          />
        ))}
      </div>

      {/* Category sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {categories.map((cat) => (
          <div key={cat} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Section header */}
            <div className="flex items-center gap-3" style={{ padding: "0 4px" }}>
              <div
                className="skeleton-shimmer shrink-0"
                style={{
                  width: "5px",
                  height: "36px",
                  borderRadius: "var(--radius-full)",
                }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: "28px", width: "140px", borderRadius: "var(--radius-sm)" }}
              />
            </div>

            {/* Item rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="skeleton-shimmer"
                  style={{
                    height: "120px",
                    width: "100%",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-light)",
                    background: "var(--bg-card)",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
