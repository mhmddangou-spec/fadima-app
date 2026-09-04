"use client";

import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Hash,
  Plus,
  AlertTriangle,
  Package,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SalesChart from "@/components/charts/SalesChart";
import { formatCFA, formatRelative, getStatusColor, formatPaymentMethod } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import { ChartDataPoint } from "@/types";

interface Activity {
  type: "sale" | "expense";
  amount: number;
  label: string;
  date: string;
  method?: string;
  description?: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock_quantity: number;
  min_stock_alert: number;
}

interface ActiveDebt {
  customer_name: string;
  remaining_amount: number;
  status: string;
}

interface DashboardClientProps {
  userName: string;
  businessName: string;
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  todaySalesCount: number;
  chartData: ChartDataPoint[];
  recentActivity: Activity[];
  lowStockProducts: LowStockProduct[];
  activeDebts: ActiveDebt[];
}

export default function DashboardClient({
  userName,
  businessName,
  todaySales,
  todayExpenses,
  todayProfit,
  todaySalesCount,
  chartData,
  recentActivity,
  lowStockProducts,
  activeDebts,
}: DashboardClientProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{businessName}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/sales/new" className="btn-primary text-sm px-4 py-2.5 min-h-0">
            <Plus className="w-4 h-4" />
            Vente
          </Link>
          <Link href="/expenses/new" className="btn-secondary text-sm px-4 py-2.5 min-h-0">
            <Plus className="w-4 h-4" />
            Dépense
          </Link>
        </div>
      </div>

      {/* ── Alertes ── */}
      {(lowStockProducts.length > 0 || activeDebts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lowStockProducts.length > 0 && (
            <Link
              href="/products"
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 hover:bg-amber-100 transition-colors"
            >
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">
                  ⚠️ {lowStockProducts.length} produit{lowStockProducts.length > 1 ? "s" : ""} presque épuisé{lowStockProducts.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-amber-600 truncate">
                  {lowStockProducts.map((p) => p.name).join(", ")}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0" />
            </Link>
          )}
          {activeDebts.length > 0 && (
            <Link
              href="/debts"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5 hover:bg-red-100 transition-colors"
            >
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ {activeDebts.length} client{activeDebts.length > 1 ? "s" : ""} avec des dettes
                </p>
                <p className="text-xs text-red-600 truncate">
                  {activeDebts.map((d) => d.customer_name).join(", ")}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Ventes aujourd'hui"
          value={todaySales}
          color="green"
          icon={<ShoppingBag className="w-5 h-5" />}
          subtitle="aujourd'hui"
        />
        <StatCard
          title="Dépenses"
          value={todayExpenses}
          color="red"
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="aujourd'hui"
        />
        <StatCard
          title="Résultat estimé"
          value={todayProfit}
          color={todayProfit >= 0 ? "green" : "red"}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="aujourd'hui"
        />
        <div className="bg-white rounded-xl border border-blue-100 p-4 sm:p-5 transition-all hover:shadow-card-hover">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-blue-700">Ventes</p>
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Hash className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{todaySalesCount}</div>
          <p className="text-xs text-gray-500">opérations aujourd'hui</p>
        </div>
      </div>

      {/* ── Graphique + Activité ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Graphique */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Évolution des ventes</h2>
              <p className="text-xs text-gray-500">7 derniers jours</p>
            </div>
            <Link
              href="/analytics"
              className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <SalesChart data={chartData} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-0.5 bg-primary-600 rounded" />
              Ventes
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-0.5 bg-red-400 rounded border-dashed" />
              Dépenses
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Activité récente</h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm text-center">Aucune activité aujourd'hui</p>
              <Link href="/sales/new" className="mt-3 text-xs text-primary-600 font-semibold">
                Enregistrer une vente →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        item.type === "sale" ? "bg-primary-50" : "bg-red-50"
                      )}
                    >
                      {item.type === "sale" ? (
                        <ShoppingBag className="w-4 h-4 text-primary-600" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
                      <p className="text-xs text-gray-400">{formatRelative(item.date)}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-bold flex-shrink-0 ml-2",
                      item.type === "sale" ? "text-primary-700" : "text-red-600"
                    )}
                  >
                    {item.type === "sale" ? "+" : "-"}{formatCFA(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bouton principal ── */}
      <div className="fixed bottom-20 right-4 lg:hidden z-30">
        <Link
          href="/sales/new"
          className="w-14 h-14 gradient-primary rounded-full shadow-elevated flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Plus className="w-7 h-7 text-white" />
        </Link>
      </div>
    </div>
  );
}
