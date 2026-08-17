import { useCallback, useEffect, useState } from "react";

export function useResource(loader) {
  const [state, setState] = useState({
    loading: true,
    data: [],
    error: null,
  });

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const data = await loader();
      setState({ loading: false, data, error: null });
    } catch (error) {
      setState({ loading: false, data: [], error });
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
