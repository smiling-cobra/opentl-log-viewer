"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchLogs } from "@/lib/api";
import { flattenLogs } from "@/lib/transform";
import type { FlatLogRecord, UseLogsResult } from "@/lib/types";

export const useExpandedSet = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  return { expanded, toggle, collapseAll };
};

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
