import type { IExportLogsServiceRequest } from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";

const API_URL = process.env.NEXT_PUBLIC_LOGS_API_URL;

export const fetchLogs = async (): Promise<IExportLogsServiceRequest> => {
  if (!API_URL) {
    throw new Error("API URL is not defined");
  }

  const response = await fetch(API_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch logs: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};
