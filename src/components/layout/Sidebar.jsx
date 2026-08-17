import Icon from "../common/Icon";

const NAV_ITEMS = ["Dashboard", "Skills", "Projects", "Developers"];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage("Dashboard")}>
        <span className="brand-mark">W</span>
        <span>
          WEXA <b>Graph</b>
        </span>
      </button>

      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={page === item ? "nav-item active" : "nav-item"}
            onClick={() => setPage(item)}
          >
            <span><Icon name={item} /></span>
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-note">
        <span className="pulse" /> Live graph API
        <br />
        <small>CognoDB via Neo4j driver</small>
      </div>
    </aside>
  );
}
