export default function Notice({ error, retry }) {
  if (error) {
    return (
      <div className="notice error">
        <span>{error.message || "Something went wrong."}</span>
        {retry && <button onClick={retry}>Retry</button>}
      </div>
    );
  }

  return (
    <div className="notice">
      <span className="spinner" />
      Loading graph data…
    </div>
  );
}
