import Notice from "../common/Notice";

function getItemName(item) {
  if (!item) return "";

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object") {
    return item.name || item.id || "";
  }

  return String(item);
}

function getItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map(getItemName)
    .filter(Boolean);
}

export default function DetailPanel({ state, close }) {
  if (!state) {
    return null;
  }

  const {
    type,
    data,
    loading,
    error,
    related,
    recommendations,
  } = state;

  const groups = [];

  // -------------------------
  // Skills
  // -------------------------
  if (data?.skills) {
    groups.push({
      title: "Skills",
      items: getItems(data.skills),
    });
  }

  // -------------------------
  // Projects
  // -------------------------
  if (data?.projects) {
    groups.push({
      title: "Projects",
      items: getItems(data.projects),
    });
  }

  // -------------------------
  // Developers
  // -------------------------
  if (data?.developers) {
    groups.push({
      title: "Developers",
      items: getItems(data.developers),
    });
  }

  // -------------------------
  // Related Developers
  // -------------------------
  if (Array.isArray(related)) {
    groups.push({
      title: "Shared-skill peers (2-hop)",
      items: related
        .map((developer) => {
          const name = getItemName(developer);

          const sharedSkills = Array.isArray(
            developer.sharedSkills,
          )
            ? developer.sharedSkills.join(", ")
            : "";

          return sharedSkills
            ? `${name} · ${sharedSkills}`
            : name;
        })
        .filter(Boolean),
    });
  }

  // -------------------------
  // Recommended Skills
  // -------------------------
  if (Array.isArray(recommendations)) {
    groups.push({
      title: "Suggested skills (3-hop)",
      items: getItems(recommendations),
    });
  }

  return (
    <div
      className="overlay"
      onClick={close}
    >
      <aside
        className="detail-panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Close */}
        <button
          className="close"
          onClick={close}
          aria-label="Close details"
        >
          ×
        </button>

        {/* Loading */}
        {loading && (
          <Notice />
        )}

        {/* Error */}
        {!loading && error && (
          <Notice
            error={error}
            retry={state.reload}
          />
        )}

        {/* Content */}
        {!loading &&
          !error &&
          data && (
            <>
              <p className="eyebrow">
                {type} detail · live API
              </p>

              <h2>
                {data.name || "Unknown"}
              </h2>

              <p className="detail-copy">
                {data.description ||
                  data.role ||
                  [data.category, data.level]
                    .filter(Boolean)
                    .join(" · ")}
              </p>

              {groups.map(
                ({ title, items }) => (
                  <section
                    className="detail-list"
                    key={title}
                  >
                    <h3>{title}</h3>

                    {items.length > 0 ? (
                      items.map(
                        (item, index) => (
                          <span
                            key={`${title}-${index}`}
                          >
                            ● {item}
                          </span>
                        ),
                      )
                    ) : (
                      <p>
                        None yet
                      </p>
                    )}
                  </section>
                ),
              )}
            </>
          )}
      </aside>
    </div>
  );
}