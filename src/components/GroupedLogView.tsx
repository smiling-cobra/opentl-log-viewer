"use client";

import { useMemo } from "react";
import type { FlatLogRecord, ServiceGroup } from "@/lib/types";
import { groupByService } from "@/lib/grouping";
import { useExpandedSet } from "@/lib/hooks";
import { LogTable } from "@/components/LogTable";

interface GroupedLogViewProps {
  logs: FlatLogRecord[];
  expanded: Set<string>;
  onToggle: (name: string) => void;
}

interface ServiceGroupPanelProps {
  group: ServiceGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

const Chevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-400 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const LogCountBadge = ({ count }: { count: number }) => (
  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
    {count} logs
  </span>
);

const ServiceGroupPanel = ({
  group,
  isExpanded,
  onToggle,
}: ServiceGroupPanelProps) => {
  const { expanded: expandedRows, toggle: toggleRow } = useExpandedSet();
  return (
    <div className="rounded-lg border border-gray-200 mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">
            {group.serviceName}
          </span>
          <span className="text-xs text-gray-400">
            {group.serviceNamespace} · {group.serviceVersion}
          </span>
          <LogCountBadge count={group.logs.length} />
        </div>
        <Chevron expanded={isExpanded} />
      </button>
      {isExpanded && (
        <div className="border-t border-gray-200">
          <LogTable
            logs={group.logs}
            bordered={false}
            expanded={expandedRows}
            onToggle={toggleRow}
          />
        </div>
      )}
    </div>
  );
};

export const GroupedLogView = ({ logs, expanded, onToggle }: GroupedLogViewProps) => {
  const groups = useMemo(() => groupByService(logs), [logs]);

  return (
    <div>
      {groups.map((group) => (
        <ServiceGroupPanel
          key={group.serviceName}
          group={group}
          isExpanded={expanded.has(group.serviceName)}
          onToggle={() => onToggle(group.serviceName)}
        />
      ))}
    </div>
  );
};
