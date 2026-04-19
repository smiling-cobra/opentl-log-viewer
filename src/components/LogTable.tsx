import { Fragment } from "react";
import type { FlatLogRecord } from "@/lib/types";

const SEVERITY_CLASSES: Record<string, string> = {
  TRACE: "bg-slate-100 text-slate-700",
  DEBUG: "bg-blue-100 text-blue-700",
  INFO: "bg-green-100 text-green-700",
  WARN: "bg-amber-100 text-amber-700",
  ERROR: "bg-red-100 text-red-700",
  FATAL: "bg-purple-100 text-purple-700",
  UNSPECIFIED: "bg-gray-100 text-gray-700",
};

const SeverityBadge = ({ severityText }: { severityText: string }) => {
  const classes =
    SEVERITY_CLASSES[severityText] ?? SEVERITY_CLASSES.UNSPECIFIED;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {severityText}
    </span>
  );
};

interface LogRowProps {
  log: FlatLogRecord;
  isExpanded: boolean;
  onToggle: () => void;
}

const LogRow = ({ log, isExpanded, onToggle }: LogRowProps) => {
  return (
    <tr
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <td className="px-4 py-3">
        <SeverityBadge severityText={log.severityText} />
      </td>
      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
        {new Date(log.timeMs).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-900 truncate max-w-xl">{log.body}</td>
    </tr>
  );
};

const LogRowDetail = ({ log }: { log: FlatLogRecord }) => {
  return (
    <tr className="bg-gray-50">
      <td colSpan={3} className="px-6 py-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Body
            </p>
            <p className="text-sm text-gray-900">{log.body}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Attributes
            </p>
            {log.attributes.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No attributes</p>
            ) : (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {log.attributes.map((attr) => (
                  <Fragment key={attr.key}>
                    <dt className="text-xs font-mono text-gray-500">
                      {attr.key}
                    </dt>
                    <dd className="text-xs font-mono text-gray-900">
                      {attr.value}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export const LogTable = ({
  logs,
  bordered = true,
  expanded: expandedIds,
  onToggle: toggleRow,
}: {
  logs: FlatLogRecord[];
  bordered?: boolean;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) => {
  return (
    <div
      className={`overflow-x-auto${bordered ? " rounded-lg border border-gray-200" : ""}`}
    >
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-28">
              Severity
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-44">
              Time
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Body
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {logs.map((log) => (
            <Fragment key={log.id}>
              <LogRow
                log={log}
                isExpanded={expandedIds.has(log.id)}
                onToggle={() => toggleRow(log.id)}
              />
              {expandedIds.has(log.id) && <LogRowDetail log={log} />}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
