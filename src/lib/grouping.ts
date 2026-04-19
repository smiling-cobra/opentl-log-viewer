import type { FlatLogRecord, ServiceGroup } from "@/lib/types";

export const groupByService = (logs: FlatLogRecord[]): ServiceGroup[] => {
  const groups = new Map<string, ServiceGroup>();

  for (const log of logs) {
    const existing = groups.get(log.serviceName);
    if (existing) {
      existing.logs.push(log);
    } else {
      groups.set(log.serviceName, {
        serviceName: log.serviceName,
        serviceNamespace: log.serviceNamespace,
        serviceVersion: log.serviceVersion,
        logs: [log],
      });
    }
  }

  return Array.from(groups.values());
};
