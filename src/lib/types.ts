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
