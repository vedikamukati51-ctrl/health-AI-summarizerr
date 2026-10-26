import { useCallback, useState } from "react";

export function useApi<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { data, loading, error, execute };
}