import Notice from "../common/Notice";

function getName(item) {
  if (item == null) return "";

  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (typeof item === "object") {
    return item.name || item.id || "";
  }

  return "";
}

function getItems(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map(getName)
    .filter(Boolean);
}

export default function DetailPanel({ state, close }) {
  if (!state) return null;

  const {
    type,
    data,
    loading,
    error,
    related = [],
    recommendations = [],
  } = state;

  const groups = [];

  if (Array.isArray(data?.skills)) {
    groups.push([
      "Skills",
      getItems(data.skills),
    ]);
  }

  if (Array.isArray(data?.projects)) {
    groups.push([
      "Projects",
      getItems(data.projects),
    ]);
  }

  if (Array.isArray(data?.developers)) {
    groups.push([
      "Developers",
      getItems(data.developers),
    ]);
  }

  if (Array.isArray(related)) {
    groups.push([
      "Shared-skill peers (2-hop)",
      related
        .map((item) => {
          const name = getName(item);

          const sharedSkills = Array.isArray(
            item?.sharedSkills
          )
            ? item.sharedSkills
                .map(getName)
                .filter(Boolean)
                .join(", ")
            : "";

          if (!name) return "";

          return sharedSkills
            ? `${name} · ${sharedSkills}`
            : name;
        })
        .filter(Boolean),
    ]);
  }

  if (Array.isArray(recommendations)) {
    groups.push([
      "Suggested skills (3-hop)",
      getItems(recommendations),
    ]);
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
        <button
          className="close"
          onClick={close}
          aria-label="Close details"
        >
          ×
        </button>

        {loading && <Notice />}

        {!loading && error && (
          <Notice
            error={error}
            retry={state.reload}
          />
        )}

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
                  [
                    data.category,
                    data.level,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
              </p>

              {groups.map(
                ([label, items]) => (
                  <section
                    className="detail-list"
                    key={label}
                  >
                    <h3>{label}</h3>

                    {items.length > 0 ? (
                      items.map(
                        (item, index) => (
                          <span
                            key={`${label}-${item}-${index}`}
                          >
                            ● {item}
                          </span>
                        )
                      )
                    ) : (
                      <p>None yet</p>
                    )}
                  </section>
                )
              )}
            </>
          )}
      </aside>
    </div>
  );
}