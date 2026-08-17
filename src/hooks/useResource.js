import {
  useCallback,
  useEffect,
  useState,
} from "react";

export function useResource(loader) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await loader();

      setData(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      console.error("API error:", err);

      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}