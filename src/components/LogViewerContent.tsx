"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FlatLogRecord } from "@/lib/types";
import { LogHistogram } from "@/components/LogHistogram";
import { LogTable } from "@/components/LogTable";
import { GroupedLogView } from "@/components/GroupedLogView";

type ViewMode = "flat" | "grouped";

const TOGGLE_BUTTON_BASE = "px-4 py-2 text-sm font-medium transition-colors";
const TOGGLE_BUTTON_ACTIVE = "bg-white text-gray-900 shadow-sm";
const TOGGLE_BUTTON_INACTIVE = "bg-gray-50 text-gray-500 hover:text-gray-700";

export const LogViewerContent = ({ logs }: { logs: FlatLogRecord[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view: ViewMode =
    searchParams.get("view") === "grouped" ? "grouped" : "flat";

  const setView = useCallback(
    (next: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", next);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const filteredLogs = logs;

  return (
    <>
      <LogHistogram logs={logs} />
      <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6 w-fit">
        <button
          onClick={() => setView("flat")}
          className={`${TOGGLE_BUTTON_BASE} ${view === "flat" ? TOGGLE_BUTTON_ACTIVE : TOGGLE_BUTTON_INACTIVE}`}
        >
          Flat
        </button>
        <button
          onClick={() => setView("grouped")}
          className={`${TOGGLE_BUTTON_BASE} border-l border-gray-200 ${view === "grouped" ? TOGGLE_BUTTON_ACTIVE : TOGGLE_BUTTON_INACTIVE}`}
        >
          Group by Service
        </button>
      </div>
      {view === "flat" ? (
        <LogTable logs={filteredLogs} />
      ) : (
        <GroupedLogView logs={filteredLogs} />
      )}
    </>
  );
};
