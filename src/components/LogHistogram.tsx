"use client";

import type React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FlatLogRecord } from "@/lib/types";
import { buildHistogram } from "@/lib/histogram";

const CHART_HEIGHT = 140;
const X_AXIS_INTERVAL = 4;
const Y_AXIS_WIDTH = 32;
const BAR_RADIUS: [number, number, number, number] = [2, 2, 0, 0];
const TICK_STYLE = { fontSize: 11, fill: "#6b7280" };
const GRID_STROKE = "#e5e7eb";
const BAR_FILL = "#6366f1";
const CURSOR_FILL = "#f3f4f6";

const formatTickDate = (date: string) =>
  new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatLabelDate = (date: unknown) =>
  typeof date === "string"
    ? new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : String(date);

const formatCount = (value: unknown): [React.ReactNode, string] => [
  value as React.ReactNode,
  "logs",
];

export const LogHistogram = ({ logs }: { logs: FlatLogRecord[] }) => {
  const data = buildHistogram(logs);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-2 mb-6">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Log Volume
      </p>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            horizontal
            vertical={false}
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatTickDate}
            interval={X_AXIS_INTERVAL}
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            width={Y_AXIS_WIDTH}
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: CURSOR_FILL }}
            labelFormatter={formatLabelDate}
            formatter={formatCount}
          />
          <Bar
            dataKey="count"
            fill={BAR_FILL}
            radius={BAR_RADIUS}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
