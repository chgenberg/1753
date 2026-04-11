"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const COLORS = {
  green: "#108474",
  brown: "#766a62",
  dark: "#1d1d1f",
  darkLight: "#515151",
  bg: "#f5f5f7",
  white: "#ffffff",
  gray: "#e6e6e6",
  gold: "#fcb237",
};

const CHART_PALETTE = [
  "#108474", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#14b8a6", "#a855f7", "#3b82f6",
];

/* ─── Generic tooltip ─── */

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
  valueFormatter?: (v: number, key: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const fmt = valueFormatter ?? ((v: number) => String(v));
  return (
    <div className="rounded-xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-black/[0.06] backdrop-blur-lg">
      {label && <p className="text-xs font-medium text-[#515151]">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="mt-1 text-sm font-semibold" style={{ color: p.color }}>
          {fmt(p.value, p.dataKey)}
        </p>
      ))}
    </div>
  );
}

/* ─── ChartCard wrapper ─── */

export function ChartCard({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f]">{title}</h3>
          {subtitle && <p className="text-xs text-[#515151]">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

/* ─── KPI Card ─── */

export function KpiCard({
  label,
  value,
  icon: Icon,
  isCurrency,
  loading,
  trend,
  trendValue,
  color = COLORS.green,
}: {
  label: string;
  value: number;
  icon?: LucideIcon;
  isCurrency?: boolean;
  loading?: boolean;
  trend?: "up" | "down" | null;
  trendValue?: string;
  color?: string;
}) {
  const formatted = isCurrency
    ? Math.round(value).toLocaleString("sv-SE") + " kr"
    : value.toLocaleString("sv-SE");

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        {Icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-28 animate-pulse rounded-lg bg-[#e6e6e6]" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-[#e6e6e6]" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{formatted}</p>
            <p className="mt-1 text-sm text-[#515151]">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Area Chart ─── */

export function AreaChartComponent({
  data,
  dataKey,
  xKey = "label",
  height = 300,
  color = COLORS.green,
  gradientId,
  valueFormatter,
  yTickFormatter,
  loading,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  color?: string;
  gradientId?: string;
  valueFormatter?: (v: number, key: string) => string;
  yTickFormatter?: (v: number) => string;
  loading?: boolean;
}) {
  const gId = gradientId ?? `grad-${dataKey}`;

  if (loading) return <div className="w-full animate-pulse rounded-2xl bg-[#f5f5f7]" style={{ height }} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={{ stroke: COLORS.gray }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={false}
          tickFormatter={yTickFormatter}
          width={50}
        />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gId})`}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Bar Chart ─── */

export function BarChartComponent({
  data,
  dataKey,
  xKey = "label",
  height = 280,
  color = COLORS.green,
  valueFormatter,
  loading,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  color?: string;
  valueFormatter?: (v: number, key: string) => string;
  loading?: boolean;
}) {
  if (loading) return <div className="w-full animate-pulse rounded-2xl bg-[#f5f5f7]" style={{ height }} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={{ stroke: COLORS.gray }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={30}
        />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
          animationEasing="ease-out"
          maxBarSize={40}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

/* ─── Line Chart ─── */

export function LineChartComponent({
  data,
  dataKey,
  xKey = "label",
  height = 200,
  color = COLORS.green,
  valueFormatter,
  loading,
  dot = true,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  color?: string;
  valueFormatter?: (v: number, key: string) => string;
  loading?: boolean;
  dot?: boolean;
}) {
  if (loading) return <div className="w-full animate-pulse rounded-2xl bg-[#f5f5f7]" style={{ height }} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={{ stroke: COLORS.gray }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.darkLight }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={dot ? { r: 4, fill: color, stroke: COLORS.white, strokeWidth: 2 } : false}
          activeDot={{ r: 6, fill: color, stroke: COLORS.white, strokeWidth: 2 }}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

/* ─── Donut / Pie Chart ─── */

export function DonutChart({
  data,
  nameKey = "name",
  valueKey = "value",
  colors,
  labels,
  height = 200,
  innerRadius = 55,
  outerRadius = 85,
  loading,
}: {
  data: Record<string, unknown>[];
  nameKey?: string;
  valueKey?: string;
  colors?: Record<string, string>;
  labels?: Record<string, string>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="h-40 w-40 animate-pulse rounded-full bg-[#f5f5f7]" />
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey={valueKey}
            nameKey={nameKey}
            animationDuration={800}
            animationEasing="ease-out"
            stroke="none"
          >
            {data.map((entry, i) => {
              const name = String(entry[nameKey] ?? "");
              return (
                <Cell
                  key={name}
                  fill={colors?.[name] ?? CHART_PALETTE[i % CHART_PALETTE.length]}
                />
              );
            })}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0];
              const name = String(d.name ?? "");
              return (
                <div className="rounded-xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-black/[0.06] backdrop-blur-lg">
                  <p className="text-xs font-medium text-[#515151]">{labels?.[name] ?? name}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: (d.payload as Record<string, unknown>)?.fill as string }}>
                    {String(d.value)}
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((entry, i) => {
          const name = String(entry[nameKey] ?? "");
          const color = colors?.[name] ?? CHART_PALETTE[i % CHART_PALETTE.length];
          return (
            <div key={name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[#515151]">{labels?.[name] ?? name}</span>
              </div>
              <span className="font-medium text-[#1d1d1f] tabular-nums">{String(entry[valueKey] ?? 0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Horizontal Progress Bar ─── */

export function ProgressBar({
  value,
  max = 100,
  color = COLORS.green,
  label,
  valueLabel,
  size = "md",
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  valueLabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-[#1d1d1f] truncate">{label}</span>}
          {valueLabel && <span className="text-sm font-semibold text-[#1d1d1f] tabular-nums ml-3">{valueLabel}</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-[#f5f5f7] overflow-hidden ${heights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ─── Score Ring (circular gauge) ─── */

export function ScoreRing({
  score,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = COLORS.green,
  label,
}: {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(1, score / max);
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.bg} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold text-[#1d1d1f]">{Math.round(score)}</span>
        {label && <span className="text-[10px] text-[#515151] uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}

/* ─── Spark Line (mini inline chart) ─── */

export function SparkLine({
  data,
  dataKey,
  width = 100,
  height = 32,
  color = COLORS.green,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsLineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          animationDuration={800}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

/* ─── Chart Skeleton ─── */

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <div className="w-full animate-pulse rounded-2xl bg-[#f5f5f7]" style={{ height }} />;
}
