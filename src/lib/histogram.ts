import type { FlatLogRecord, HistogramBucket } from "@/lib/types";

export const buildHistogram = (logs: FlatLogRecord[]): HistogramBucket[] => {
  if (logs.length === 0) return [];

  const counts = new Map<string, number>();
  let minMs = Infinity;
  let maxMs = -Infinity;

  for (const log of logs) {
    const date = new Date(log.timeMs).toISOString().slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
    if (log.timeMs < minMs) minMs = log.timeMs;
    if (log.timeMs > maxMs) maxMs = log.timeMs;
  }

  const minDate = new Date(minMs).toISOString().slice(0, 10);
  const maxDate = new Date(maxMs).toISOString().slice(0, 10);

  const buckets: HistogramBucket[] = [];
  const cursor = new Date(minDate + "T00:00:00Z");

  while (cursor.toISOString().slice(0, 10) <= maxDate) {
    const date = cursor.toISOString().slice(0, 10);
    buckets.push({ date, count: counts.get(date) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return buckets;
};
