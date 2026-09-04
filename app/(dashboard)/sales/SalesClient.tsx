"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, ShoppingBag, Search, Filter,
  ChevronRight, TrendingUp, Calendar, CreditCard,
} from "lucide-react";
import { formatCFA, formatDateShort, formatRelative, formatPaymentMethod, getStatusColor, formatPaymentStatus } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";

interface SaleItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Sale {
  id: string;
  total_amount: number;
  paid_amount: number;
  payment_method: string;
  payment_status: string;
  sold_at: string;
  notes?: string;
  discount_amount: number;
  customers?: { name: string; phone?: string } | null;
  sale_items?: SaleItem[];
}

interface SalesClientProps {
  sales: Sale[];
  products: { id: string; name: string; selling_price: number; stock_quantity: number }[];
  customers: { id: string; name: string; phone?: string }[];
  userId: string;
}

export default function SalesClient({ sales }: SalesClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "partial" | "unpaid">("all");

  const totalToday = sales
    .filter((s) => s.sold_at.startsWith(new Date().toISOString().split("T")[0]))
    .reduce((sum, s) => sum + s.total_amount, 0);

  const filtered = sales.filter((s) => {
    const matchSearch =
      !search ||
      s.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (s.sale_items || []).some((i) => i.product_name.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || s.payment_status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
          <p className="text-gray-500 text-sm">
            {sales.length} vente{sales.length > 1 ? "s" : ""} enregistrée{sales.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/sales/new" className="btn-primary">
          <Plus className="w-5 h-5" />
          Nouvelle vente
        </Link>
      </div>

      {/* KPI rapide */}
      <div className="bg-primary-600 rounded-2xl p-5 text-white">
        <p className="text-primary-100 text-sm font-medium mb-1">Ventes aujourd'hui</p>
        <p className="text-3xl font-bold">{formatCFA(totalToday)}</p>
        <p className="text-primary-200 text-xs mt-1">
          {sales.filter((s) => s.sold_at.startsWith(new Date().toISOString().split("T")[0])).length} transaction(s)
        </p>
      </div>

      {/* Filtres + Recherche */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Rechercher par client ou produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtres statut */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "paid", "partial", "unpaid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f === "all" ? "Toutes" : f === "paid" ? "Payées" : f === "partial" ? "Partielles" : "Impayées"}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des ventes */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune vente</h3>
          <p className="text-gray-500 text-sm mb-6">
            {search ? "Aucune vente ne correspond à votre recherche." : "Commencez par enregistrer votre première vente !"}
          </p>
          <Link href="/sales/new" className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />
            Enregistrer une vente
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {sale.customers?.name || "Vente directe"}
                      </span>
                      <span className={cn("badge", getStatusColor(sale.payment_status))}>
                        {formatPaymentStatus(sale.payment_status)}
                      </span>
                    </div>
                    {/* Produits */}
                    {(sale.sale_items || []).length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {sale.sale_items!.map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatRelative(sale.sold_at)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CreditCard className="w-3 h-3" />
                        {formatPaymentMethod(sale.payment_method)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">{formatCFA(sale.total_amount)}</p>
                  {sale.payment_status === "partial" && (
                    <p className="text-xs text-red-500 mt-0.5">
                      Reste: {formatCFA(sale.total_amount - sale.paid_amount)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
