# Plan: OTLP Log Viewer — Part 1

## Context

Build a standalone Next.js (App Router) + TypeScript frontend that fetches mock OTLP log data from a provided API and visualizes it.

The app requiring three features:

- log table with expandable rows
- time histogram
- group-by-service toggle.

---

## Phase 1: Project Bootstrap

- `npx create-next-app@latest otlp-log-viewer --typescript --app --tailwind --eslint`
- Install runtime deps: `@opentelemetry/otlp-transformer`, `recharts`
- Folder structure:
  ```
  src/
    app/          # Next.js App Router pages
    components/   # UI components
    lib/          # data fetching + transformation utilities
  ```

---

## Phase 2: Data Layer

- Define `FlatLogRecord` type — a denormalized record combining log fields + parent service info:
  ```ts
  {
    (id,
      timeMs,
      severityText,
      severityNumber,
      body,
      attributes,
      serviceName,
      serviceNamespace,
      serviceVersion);
  }
  ```
- `lib/api.ts` — `fetchLogs(): Promise<IExportLogsServiceRequest>`
- `lib/transform.ts` — `flattenLogs(raw)`:
  - Iterate `resourceLogs` → extract service attrs from `resource.attributes`
  - Iterate `scopeLogs[].logRecords[]` → map to `FlatLogRecord`
  - Convert `timeUnixNano` (BigInt string) to ms: `Number(BigInt(s) / 1_000_000n)`
  - Sort result ascending by `timeMs`
- `lib/hooks.ts` — `useLogs()` hook: fetch → transform → return `{ logs, loading, error }`

---

## Phase 3: Log Table

- `components/LogTable.tsx` — accepts `logs: FlatLogRecord[]`
- Columns: **Severity** (colored badge), **Time** (formatted local datetime), **Body**
- Each row is clickable/expandable — reveals key/value attribute list beneath it
- Severity color map: TRACE=slate, DEBUG=blue, INFO=green, WARN=amber, ERROR=red, FATAL=purple, UNSPECIFIED=gray
- If `attributes` is empty, show "No attributes" in expanded section

---

## Phase 4: Histogram

- `components/LogHistogram.tsx` — accepts `logs: FlatLogRecord[]`
- Bucket by **day** (data spans ~January 2024, so daily granularity is natural)
- Build `{ date: string, count: number }[]` bucket array — include empty days as 0
- Render with Recharts `BarChart` (responsive container, `XAxis` with date labels, `YAxis`, `Tooltip`)

---

## Phase 5: Group by Service

- `components/GroupedLogView.tsx` — accepts `logs: FlatLogRecord[]`
- Groups logs by `serviceName` (use `Map` keyed on service name)
- Each group is a collapsible section: header shows service name + namespace + version + log count
- Collapsed by default; clicking header expands/collapses
- Reuses `LogTable` inside each group

---

## Phase 6: Assembly & Polish

- `app/page.tsx` — main page:
  - Calls `useLogs()`
  - Shows loading spinner and error message states
  - Layout: histogram on top, toggle button, log table/grouped view below
  - Toggle: "Flat" | "Group by Service" — simple state switch (`useState<'flat' | 'grouped'>`)
- Fetch happens once on mount (no auto-refresh — random data would thrash the UI)

---

## Caveats & Edge Cases

| Issue                                                                                  | Mitigation                                                                                   |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `timeUnixNano` is a serialized BigInt string (~19 digits) — `parseInt` loses precision | Use `BigInt(s) / 1_000_000n` then `Number()`                                                 |
| `body` is `{ stringValue: string }`, not a plain string                                | Extract `.stringValue`; fall back to `JSON.stringify(body)` for other value types            |
| `attributes[]` is `[]` in mock data but typed as present                               | Render "No attributes" gracefully when empty                                                 |
| Histogram: sparse data may produce many empty days                                     | Fill all days in `[minDate, maxDate]` range with 0-count buckets                             |
| Multiple services may share the same `service.name` (random faker nouns)               | Append index as fallback key; display all groups regardless                                  |
| No stable IDs in the response                                                          | Generate IDs client-side (`crypto.randomUUID()` or index-based) — only needed for React keys |
| `severityText` can be `"UNSPECIFIED"` or mismatched with `severityNumber`              | Prefer `severityText` from the record; fall back to number-based lookup                      |
| API returns random data each fetch — re-fetching on tab focus would confuse users      | Fetch once on mount, add manual "Refresh" button if desired                                  |
