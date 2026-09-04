"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, CreditCard, TrendingUp, Hash, Plus, Package,
  Users, ArrowRight, ChevronRight, X, Calendar, Tag, FileText,
  Bell, Zap, AlertTriangle,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SalesChart from "@/components/charts/SalesChart";
import PlanCards from "@/components/ui/PlanCards";
import { formatCFA, formatRelative, formatPaymentMethod } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import { ChartDataPoint } from "@/types";

interface Activity {
  id: string;
  type: "sale" | "expense";
  amount: number;
  label: string;
  date: string;
  method?: string;
  status?: string;
  customer_name?: string;
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
  userAvatar?: string;
  businessName: string;
  plan: string;
  operationsUsed: number;
  operationsLimit: number;
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  todaySalesCount: number;
  chartData: ChartDataPoint[];
  recentActivity: Activity[];
  lowStockProducts: LowStockProduct[];
  activeDebts: ActiveDebt[];
}

const QUICK_ACTIONS = [
  { href: "/sales/new",    label: "Vente",     emoji: "🛒", bg: "bg-primary-50",  text: "text-primary-600" },
  { href: "/expenses/new", label: "Depense",   emoji: "💸", bg: "bg-red-50",     text: "text-red-600" },
  { href: "/debts/new",    label: "Dette",     emoji: "👥", bg: "bg-amber-50",   text: "text-amber-600" },
  { href: "/sales",        label: "Transactions", emoji: "📋", bg: "bg-blue-50", text: "text-blue-600" },
];

export default function DashboardClient({
  userName, userAvatar, businessName, plan, operationsUsed, operationsLimit,
  todaySales, todayExpenses, todayProfit, todaySalesCount,
  chartData, recentActivity, lowStockProducts, activeDebts,
}: DashboardClientProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon apres-midi" : "Bonsoir";
  const firstName = userName.split(" ")[0];
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  const pct = operationsLimit > 0 ? Math.round((operationsUsed / operationsLimit) * 100) : 0;
  const isNearLimit = pct >= 80 && pct < 100;
  const isAtLimit = pct >= 100;

  const userInitials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-4 animate-fade-in">

      {/* ═══════════════════════════════════════
          HEADER — Bonjour + date + avatar
          ═══════════════════════════════════════ */}
      <div className="dashboard-header-card animate-fade-up">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-white/70 text-sm font-medium capitalize">{today}</p>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Voici un apercu de votre activite aujourd&apos;hui.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Bell className="w-4 h-4 text-white" />
              {(lowStockProducts.length > 0 || activeDebts.length > 0) && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full border border-white" />
              )}
            </button>
            <div className="w-10 h-10 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center border-2 border-white/30">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{userInitials}</span>
              )}
            </div>
          </div>
        </div>

        {/* Plan quick banner */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", plan === "free" ? "bg-white/20 text-white" : "bg-yellow-400/90 text-yellow-900")}>
              {plan === "free" ? "Plan Gratuit" : plan === "pro" ? "FADIMA Pro" : "Business"}
            </span>
            {plan === "free" && (
              <span className="text-white/60 text-xs">{operationsUsed} / {operationsLimit} operations ce mois</span>
            )}
          </div>
          {plan === "free" && (
            <button
              type="button"
              onClick={() => alert("Fonctionnalite bientot disponible !")}
              className="flex items-center gap-1 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Passer Pro
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ALERTE LIMITE DU PLAN
          ═══════════════════════════════════════ */}
      {(isNearLimit || isAtLimit) && (
        <div className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 border animate-slide-in-bottom",
          isAtLimit
            ? "bg-red-50 border-red-200"
            : "bg-amber-50 border-amber-200"
        )}>
          <AlertTriangle className={cn("w-4 h-4 flex-shrink-0", isAtLimit ? "text-red-600" : "text-amber-600")} />
          <div className="flex-1">
            <p className={cn("text-sm font-semibold", isAtLimit ? "text-red-800" : "text-amber-800")}>
              {isAtLimit
                ? "Votre limite mensuelle est atteinte."
                : "Vous approchez de votre limite mensuelle."}
            </p>
            <p className={cn("text-xs mt-0.5", isAtLimit ? "text-red-600" : "text-amber-600")}>
              {operationsUsed} / {operationsLimit} operations utilisees ce mois
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Fonctionnalite bientot disponible !")}
            className={cn("text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors", isAtLimit ? "bg-red-600 text-white hover:bg-red-700" : "bg-amber-600 text-white hover:bg-amber-700")}
          >
            Decouvrir Pro
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          KPI CARDS — 2x2 mobile, 4 cols desktop
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up delay-100">
        {/* CA Aujourd'hui */}
        <div className={cn("kpi-card kpi-card-green col-span-1")}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">CA aujourd&apos;hui</p>
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">{formatCFA(todaySales)}</div>
          <p className="text-xs text-gray-400">Chiffre d&apos;affaires</p>
        </div>

        {/* Depenses */}
        <div className="kpi-card kpi-card-red">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Depenses</p>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">{formatCFA(todayExpenses)}</div>
          <p className="text-xs text-gray-400">Aujourd&apos;hui</p>
        </div>

        {/* Resultat */}
        <div className={cn("kpi-card", todayProfit >= 0 ? "kpi-card-green" : "kpi-card-red")}>
          <div className="flex items-start justify-between mb-2">
            <p className={cn("text-xs font-semibold uppercase tracking-wide", todayProfit >= 0 ? "text-primary-600" : "text-red-600")}>Resultat</p>
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", todayProfit >= 0 ? "bg-primary-50" : "bg-red-50")}>
              <TrendingUp className={cn("w-4 h-4", todayProfit >= 0 ? "text-primary-600" : "text-red-500")} />
            </div>
          </div>
          <div className={cn("text-xl sm:text-2xl font-black leading-none mb-1", todayProfit >= 0 ? "text-primary-600" : "text-red-600")}>
            {todayProfit >= 0 ? "+" : ""}{formatCFA(todayProfit)}
          </div>
          <p className="text-xs text-gray-400">Estime du jour</p>
        </div>

        {/* Nb Ventes */}
        <div className="kpi-card kpi-card-blue">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Ventes</p>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">{todaySalesCount}</div>
          <p className="text-xs text-gray-400">Transactions</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ACTIONS RAPIDES
          ═══════════════════════════════════════ */}
      <div className="animate-fade-up delay-150">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">Actions rapides</h2>
          <Link href="/sales" className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} className="quick-action">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", a.bg)}>
                {a.emoji}
              </div>
              <span className={cn("text-xs font-semibold", a.text)}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          GRAPHIQUE + ACTIVITE RECENTE
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-up delay-200">
        {/* Graphique */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Evolution des ventes</h2>
              <p className="text-xs text-gray-400">7 derniers jours</p>
            </div>
            <Link href="/analytics" className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <SalesChart data={chartData} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-0.5 bg-primary-600 rounded" />
              Ventes
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-0.5 bg-red-400 rounded" />
              Depenses
            </div>
          </div>
        </div>

        {/* Activite recente */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Activite recente</h2>
            <Link href="/sales" className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm text-center">Aucune activite aujourd&apos;hui</p>
              <Link href="/sales/new" className="mt-3 text-xs text-primary-600 font-semibold">
                Enregistrer une vente →
              </Link>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentActivity.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedActivity(item)}
                  className="activity-row"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", item.type === "sale" ? "bg-primary-50" : "bg-red-50")}>
                      {item.type === "sale"
                        ? <ShoppingBag className="w-3.5 h-3.5 text-primary-600" />
                        : <CreditCard className="w-3.5 h-3.5 text-red-500" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{item.label}</p>
                      <p className="text-xs text-gray-400">{formatRelative(item.date)}</p>
                    </div>
                  </div>
                  <span className={cn("text-xs font-bold flex-shrink-0 ml-2", item.type === "sale" ? "text-primary-700" : "text-red-600")}>
                    {item.type === "sale" ? "+" : "-"}{formatCFA(item.amount)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ALERTES — Stock bas + Dettes
          ═══════════════════════════════════════ */}
      {(lowStockProducts.length > 0 || activeDebts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up delay-250">
          {lowStockProducts.length > 0 && (
            <Link href="/products" className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 hover:bg-amber-100 transition-colors">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">
                  ⚠️ {lowStockProducts.length} produit{lowStockProducts.length > 1 ? "s" : ""} presque epuise{lowStockProducts.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-amber-600 truncate">{lowStockProducts.map(p => p.name).join(", ")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0" />
            </Link>
          )}
          {activeDebts.length > 0 && (
            <Link href="/debts" className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5 hover:bg-red-100 transition-colors">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ {activeDebts.length} client{activeDebts.length > 1 ? "s" : ""} avec des dettes
                </p>
                <p className="text-xs text-red-600 truncate">{activeDebts.map(d => d.customer_name).join(", ")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          SECTION PLANS
          ═══════════════════════════════════════ */}
      <PlanCards
        currentPlan={plan}
        operationsUsed={operationsUsed}
        operationsLimit={operationsLimit}
      />

      {/* FAB desktop */}
      <div className="fixed bottom-8 right-8 lg:flex hidden z-30">
        <Link href="/sales/new" className="w-14 h-14 gradient-primary rounded-full shadow-elevated flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="w-7 h-7 text-white" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════
          MODAL DETAILS ACTIVITE
          ═══════════════════════════════════════ */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", selectedActivity.type === "sale" ? "bg-primary-50" : "bg-red-50")}>
                  {selectedActivity.type === "sale" ? <ShoppingBag className="w-4 h-4 text-primary-600" /> : <CreditCard className="w-4 h-4 text-red-500" />}
                </div>
                <h3 className="font-bold text-gray-900">
                  Details de la {selectedActivity.type === "sale" ? "Vente" : "Depense"}
                </h3>
              </div>
              <button onClick={() => setSelectedActivity(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-500 text-sm">Montant</span>
                <span className={cn("text-2xl font-black", selectedActivity.type === "sale" ? "text-primary-600" : "text-red-600")}>
                  {selectedActivity.type === "sale" ? "+" : "-"}{formatCFA(selectedActivity.amount)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(selectedActivity.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{selectedActivity.type === "sale" ? "Methode de paiement" : "Categorie"}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedActivity.type === "sale" ? formatPaymentMethod(selectedActivity.method || "") : selectedActivity.label}
                    </p>
                  </div>
                </div>

                {selectedActivity.type === "sale" && selectedActivity.customer_name && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Client</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedActivity.customer_name}</p>
                    </div>
                  </div>
                )}

                {selectedActivity.type === "expense" && selectedActivity.description && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Description</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedActivity.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setSelectedActivity(null)} className="w-full btn-secondary py-2.5 text-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
