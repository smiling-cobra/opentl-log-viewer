import type {
  IExportLogsServiceRequest,
  ILogRecord,
  IResourceLogs,
} from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";
import type {
  IAnyValue,
  IKeyValue,
} from "@opentelemetry/otlp-transformer/build/src/common/internal-types";
import type { FlatLogRecord } from "./types";

interface ServiceInfo {
  serviceName: string;
  serviceNamespace: string;
  serviceVersion: string;
}

const toMs = (timeUnixNano: unknown): number => {
  if (typeof timeUnixNano === "string") {
    return Number(BigInt(timeUnixNano) / 1_000_000n);
  }
  return 0;
};

const anyValueToString = (v: IAnyValue): string => {
  return JSON.stringify(v);
};

const getAttr = (attrs: IKeyValue[], key: string): string => {
  const entry = attrs.find((a) => a.key === key);

  if (!entry) {
    console.warn(`Attribute ${key} not found in resource attributes`);
    return "";
  }

  const entryValue = entry.value;
  return entryValue.stringValue ?? anyValueToString(entryValue);
};

const extractServiceInfo = (resourceLog: IResourceLogs): ServiceInfo => {
  const attrs = resourceLog.resource?.attributes ?? [];
  return {
    serviceName: getAttr(attrs, "service.name"),
    serviceNamespace: getAttr(attrs, "service.namespace"),
    serviceVersion: getAttr(attrs, "service.version"),
  };
};

const mapLogRecord = (
  logRecord: ILogRecord,
  service: ServiceInfo,
): FlatLogRecord => {
  return {
    id: crypto.randomUUID(),
    timeMs: toMs(logRecord.timeUnixNano),
    severityText: logRecord.severityText ?? "UNSPECIFIED",
    severityNumber: logRecord.severityNumber ?? 0,
    body: logRecord.body?.stringValue ?? JSON.stringify(logRecord.body ?? ""),
    attributes: (logRecord.attributes ?? []).map((attr) => ({
      key: attr.key,
      value: attr.value.stringValue ?? anyValueToString(attr.value),
    })),
    ...service,
  };
};

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
