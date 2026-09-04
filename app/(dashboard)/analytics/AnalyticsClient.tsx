// @ts-nocheck
"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, CreditCard, Hash, BarChart3 } from "lucide-react";
import { formatCFA, formatDayLabel } from "@/lib/utils/format";
import { ChartDataPoint } from "@/types";
import SalesChart from "@/components/charts/SalesChart";

interface AnalyticsClientProps {
  totalSales: number;
  totalExpenses: number;
  salesCount: number;
  avgBasket: number;
  profit: number;
  chartData: ChartDataPoint[];
  topProducts: { name: string; revenue: number; qty: number }[];
  expensesByCategory: { name: string; total: number }[];
}

const CHART_COLORS = ["#1a6b4a", "#c9a227", "#3b82f6", "#ef4444", "#8b5cf6", "#f59e0b"];

export default function AnalyticsClient({
  totalSales,
  totalExpenses,
  salesCount,
  avgBasket,
  profit,
  chartData,
  topProducts,
  expensesByCategory,
}: AnalyticsClientProps) {
  const kpis = [
    { label: "Chiffre d'affaires", value: totalSales, icon: TrendingUp, color: "text-primary-700 bg-primary-50" },
    { label: "DÃ©penses totales", value: totalExpenses, icon: CreditCard, color: "text-red-700 bg-red-50" },
    { label: "RÃ©sultat estimÃ©", value: profit, icon: TrendingUp, color: profit >= 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50" },
    { label: "Panier moyen", value: avgBasket, icon: ShoppingBag, color: "text-blue-700 bg-blue-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500 text-sm">30 derniers jours</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-lg font-bold text-gray-900">{formatCFA(kpi.value)}</p>
          </div>
        ))}
      </div>

      {/* Ventes count */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Hash className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Nombre de ventes</p>
          <p className="text-3xl font-bold text-gray-900">{salesCount}</p>
        </div>
      </div>

      {/* Graphique d'Ã©volution */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Ã‰volution sur 30 jours</h2>
        <SalesChart data={chartData.slice(-14)} />
      </div>

      {/* Top produits + DÃ©penses par catÃ©gorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top produits */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            Top produits
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucune donnÃ©e</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                      <div className="h-1 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (p.revenue / topProducts[0].revenue) * 100)}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCFA(p.revenue)}</p>
                    <p className="text-xs text-gray-400">{p.qty} vendu{p.qty > 1 ? "s" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DÃ©penses par catÃ©gorie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            DÃ©penses par catÃ©gorie
          </h2>
          {expensesByCategory.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucune dÃ©pense</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={expensesByCategory.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    dataKey="total"
                    nameKey="name"
                  >
                    {expensesByCategory.slice(0, 5).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCFA(value), ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {expensesByCategory.slice(0, 5).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCFA(cat.total)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

