"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FlatLogRecord } from "@/lib/types";
import { useExpandedSet } from "@/lib/hooks";
import { LogHistogram } from "@/components/LogHistogram";
import { LogTable } from "@/components/LogTable";
import { GroupedLogView } from "@/components/GroupedLogView";
import { LogViewerToolbar } from "@/components/LogViewerToolbar";
import type { ViewMode } from "@/components/LogViewerToolbar";

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

  const rowExpand = useExpandedSet();
  const groupExpand = useExpandedSet();
  const activeExpand = view === "flat" ? rowExpand : groupExpand;

  const filteredLogs = logs;

  return (
    <>
      <LogHistogram logs={logs} />
      <LogViewerToolbar
        view={view}
        onSetView={setView}
        hasExpanded={activeExpand.expanded.size > 0}
        onCollapseAll={activeExpand.collapseAll}
      />
      {view === "flat" ? (
        <LogTable
          logs={filteredLogs}
          expanded={rowExpand.expanded}
          onToggle={rowExpand.toggle}
        />
      ) : (
        <GroupedLogView
          logs={filteredLogs}
          expanded={groupExpand.expanded}
          onToggle={groupExpand.toggle}
        />
      )}
    </>
  );
};
