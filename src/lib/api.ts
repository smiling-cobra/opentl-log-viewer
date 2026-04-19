import type { IExportLogsServiceRequest } from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";

const LOGS_API_URL = process.env.NEXT_PUBLIC_LOGS_API_URL;

export const fetchLogs = async (): Promise<IExportLogsServiceRequest> => {
  if (!LOGS_API_URL) {
    throw new Error("Logs API URL is not defined");
  }

  const response = await fetch(LOGS_API_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch logs: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};
