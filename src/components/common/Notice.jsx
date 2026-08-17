export default function Notice({
  error,
  retry,
}) {
  if (!error) {
    return (
      <div className="notice">
        <span className="spinner" />
        <span>
          Loading graph data...
        </span>
      </div>
    );
  }

  return (
    <div className="notice error">
      <div>
        <strong>
          Couldn't load graph data.
        </strong>

        <p>
          {error.message ||
            "Something went wrong."}
        </p>
      </div>

      {retry && (
        <button onClick={retry}>
          Try again
        </button>
      )}
    </div>
  );
}