import Icon from "../common/Icon";

export default function Header({ page, query, setQuery, results, onSelect }) {
  return (
    <header>
      <p className="crumb">
        Workspace / <b>{page}</b>
      </p>

      <div className="search-wrap">
        <label className="search">
          <span><Icon name="Search" /></span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills, projects, people..."
          />
        </label>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => onSelect(item)}
              >
                <small>{item.type}</small>
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="avatar profile">AS</button>
    </header>
  );
}
