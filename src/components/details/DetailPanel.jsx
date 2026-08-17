import Notice from "../common/Notice";

export default function DetailPanel({ state, close }) {
  if (!state) return null;

  const { type, data, loading, error, related, recommendations } = state;

  const groups = [];

  if (data?.skills) {
    groups.push([
      "Skills",
      data.skills.map((item) =>
        typeof item === "string" ? item : item.name,
      ),
    ]);
  }

  if (data?.projects) {
    groups.push([
      "Projects",
      data.projects.map((item) =>
        typeof item === "string" ? item : item.name,
      ),
    ]);
  }

  if (data?.developers) {
    groups.push([
      "Developers",
      data.developers.map((item) =>
        typeof item === "string" ? item : item.name,
      ),
    ]);
  }

  if (related) {
    groups.push([
      "Shared-skill peers (2-hop)",
      related.map((item) =>
        `${item.name} · ${(item.sharedSkills || []).join(", ")}`,
      ),
    ]);
  }

  if (recommendations) {
    groups.push([
      "Suggested skills (3-hop)",
      recommendations.map((item) => item.name),
    ]);
  }

  return (
    <div className="overlay" onClick={close}>
      <aside
        className="detail-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close" onClick={close} aria-label="Close details">
          ×
        </button>

        {loading && <Notice />}

        {!loading && error && (
          <Notice error={error} retry={state.reload} />
        )}

        {!loading && !error && data && (
          <>
            <p className="eyebrow">{type} detail · live API</p>
            <h2>{data.name}</h2>
            <p className="detail-copy">
              {data.description ||
                data.role ||
                [data.category, data.level].filter(Boolean).join(" · ")}
            </p>

            {groups.map(([label, items]) => (
              <section className="detail-list" key={label}>
                <h3>{label}</h3>
                {items?.length ? (
                  items.map((item, index) => (
                    <span key={`${label}-${item}-${index}`}>● {item}</span>
                  ))
                ) : (
                  <p>None yet</p>
                )}
              </section>
            ))}
          </>
        )}
      </aside>
    </div>
  );
}
