"use client";

import { useState, useEffect } from "react";
import { fetchLogs } from "./api";
import { flattenLogs } from "./transform";
import type { FlatLogRecord } from "./types";

interface UseLogsResult {
  logs: FlatLogRecord[];
  loading: boolean;
  error: string | null;
}

export const useLogs = (): UseLogsResult => {
  const [logs, setLogs] = useState<FlatLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const rawLogs = await fetchLogs();
        setLogs(flattenLogs(rawLogs));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { logs, loading, error };
};
