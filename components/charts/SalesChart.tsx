"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { formatDayLabel } from "@/lib/utils/format";

interface SalesChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-elevated border border-gray-100 p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value.toLocaleString("fr-FR")} FCFA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data, loading }: SalesChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: formatDayLabel(d.date),
  }));

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="skeleton w-full h-full rounded-xl" />
      </div>
    );
  }

  if (!data.length || data.every((d) => d.ventes === 0 && d.depenses === 0)) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-sm">Aucune donnée pour cette période</p>
        <p className="text-xs mt-1">Enregistrez vos premières ventes !</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1a6b4a" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#1a6b4a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="ventes"
          name="Ventes"
          stroke="#1a6b4a"
          strokeWidth={2.5}
          fill="url(#colorVentes)"
          dot={{ fill: "#1a6b4a", strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="depenses"
          name="Dépenses"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#colorDepenses)"
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, strokeWidth: 2 }}
          strokeDasharray="4 2"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
