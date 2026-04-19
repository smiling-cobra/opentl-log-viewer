export interface FlatLogRecord {
  id: string;
  timeMs: number;
  severityText: string;
  severityNumber: number;
  body: string;
  attributes: { key: string; value: string }[];
  serviceName: string;
  serviceNamespace: string;
  serviceVersion: string;
}

export interface ServiceInfo {
  serviceName: string;
  serviceNamespace: string;
  serviceVersion: string;
}

export interface UseLogsResult {
  logs: FlatLogRecord[];
  loading: boolean;
  error: string | null;
}

export interface HistogramBucket {
  date: string;  // YYYY-MM-DD
  count: number;
}
