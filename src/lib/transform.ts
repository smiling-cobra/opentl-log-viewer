import type {
  IExportLogsServiceRequest,
  ILogRecord,
  IResourceLogs,
} from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";
import type { IKeyValue } from "@opentelemetry/otlp-transformer/build/src/common/internal-types";
import type { FlatLogRecord, ServiceInfo } from "@/lib/types";
import { toMs, anyValueToString, getAttr } from "@/lib/otlp";

const extractServiceInfo = (resourceLog: IResourceLogs): ServiceInfo => {
  const attrs = resourceLog.resource?.attributes ?? [];
  return {
    serviceName: getAttr(attrs, "service.name"),
    serviceNamespace: getAttr(attrs, "service.namespace"),
    serviceVersion: getAttr(attrs, "service.version"),
  };
};

const mapAttribute = (attr: IKeyValue): { key: string; value: string } => ({
  key: attr.key,
  value: attr.value.stringValue ?? anyValueToString(attr.value),
});

const mapLogRecord = (
  logRecord: ILogRecord,
  service: ServiceInfo,
): FlatLogRecord => ({
  id: crypto.randomUUID(),
  timeMs: toMs(logRecord.timeUnixNano),
  severityText: logRecord.severityText ?? "UNSPECIFIED",
  severityNumber: logRecord.severityNumber ?? 0,
  body: logRecord.body?.stringValue ?? JSON.stringify(logRecord.body ?? ""),
  attributes: (logRecord.attributes ?? []).map(mapAttribute),
  ...service,
});

export const flattenLogs = (
  raw: IExportLogsServiceRequest,
): FlatLogRecord[] => {
  return (raw.resourceLogs ?? [])
    .flatMap((resourceLog) => {
      const service = extractServiceInfo(resourceLog);
      return (resourceLog.scopeLogs ?? []).flatMap((scopeLog) =>
        (scopeLog.logRecords ?? []).map((logRecord) =>
          mapLogRecord(logRecord, service),
        ),
      );
    })
    .sort((a, b) => a.timeMs - b.timeMs);
};
