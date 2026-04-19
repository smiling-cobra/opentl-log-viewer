import type { IExportLogsServiceRequest } from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";

const LOGS_API_URL =
  "https://take-home-assignment-otlp-logs-api.vercel.app/api/logs";

export const fetchLogs = async (): Promise<IExportLogsServiceRequest> => {
  const response = await fetch(LOGS_API_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch logs: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};
