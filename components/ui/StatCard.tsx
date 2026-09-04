"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCFA } from "@/lib/utils/format";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: number; // pourcentage
  color?: "green" | "red" | "yellow" | "blue" | "purple";
  icon?: React.ReactNode;
  loading?: boolean;
  large?: boolean;
}

const colorMap = {
  green: {
    bg: "bg-primary-50",
    text: "text-primary-700",
    value: "text-primary-700",
    border: "border-primary-100",
    icon: "bg-primary-100 text-primary-600",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    value: "text-red-700",
    border: "border-red-100",
    icon: "bg-red-100 text-red-600",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    value: "text-amber-700",
    border: "border-amber-100",
    icon: "bg-amber-100 text-amber-600",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    value: "text-blue-700",
    border: "border-blue-100",
    icon: "bg-blue-100 text-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    value: "text-purple-700",
    border: "border-purple-100",
    icon: "bg-purple-100 text-purple-600",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  color = "green",
  icon,
  loading = false,
  large = false,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-card-hover",
        colors.border
      )}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-3 w-16" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <p className={cn("text-sm font-medium", colors.text)}>{title}</p>
            {icon && (
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", colors.icon)}>
                {icon}
              </div>
            )}
          </div>

          {/* Value */}
          <div className={cn("font-bold", large ? "text-3xl" : "text-2xl", "text-gray-900 leading-none mb-2")}>
            {formatCFA(value)}
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-2">
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-semibold",
                trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-400"
              )}>
                {trend > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
