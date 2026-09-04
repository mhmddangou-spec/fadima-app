// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Dates
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Récupérer les données en parallèle
  const [salesResult, expensesResult, debtsResult, productsResult, businessResult] =
    await Promise.all([
      // Ventes d'aujourd'hui
      supabase
        .from("sales")
        .select("total_amount, sold_at, payment_method, payment_status, customers(name)")
        .eq("user_id", user.id)
        .gte("sold_at", todayStart.toISOString())
        .lte("sold_at", todayEnd.toISOString())
        .order("sold_at", { ascending: false }),

      // Dépenses d'aujourd'hui
      supabase
        .from("expenses")
        .select("amount, spent_at, category_name, description")
        .eq("user_id", user.id)
        .gte("spent_at", todayStart.toISOString())
        .lte("spent_at", todayEnd.toISOString())
        .order("spent_at", { ascending: false }),

      // Dettes actives
      supabase
        .from("debts")
        .select("remaining_amount, customer_name, status")
        .eq("user_id", user.id)
        .in("status", ["unpaid", "partial"])
        .order("created_at", { ascending: false })
        .limit(5),

      // Produits avec stock bas
      supabase
        .from("products")
        .select("id, name, stock_quantity, min_stock_alert")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .filter("stock_quantity", "lte", "min_stock_alert" as unknown as number)
        .limit(5),

      // Business info
      supabase
        .from("businesses")
        .select("name")
        .eq("user_id", user.id)
        .single(),
    ]);

  // Ventes des 7 derniers jours pour le graphique
  const { data: weekSales } = await supabase
    .from("sales")
    .select("total_amount, sold_at")
    .eq("user_id", user.id)
    .gte("sold_at", sevenDaysAgo.toISOString())
    .order("sold_at", { ascending: true });

  const { data: weekExpenses } = await supabase
    .from("expenses")
    .select("amount, spent_at")
    .eq("user_id", user.id)
    .gte("spent_at", sevenDaysAgo.toISOString())
    .order("spent_at", { ascending: true });

  // Calculer les KPIs
  const todaySales = (salesResult.data || []).reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const todayExpenses = (expensesResult.data || []).reduce((sum, e) => sum + (e.amount || 0), 0);
  const todayProfit = todaySales - todayExpenses;
  const todaySalesCount = (salesResult.data || []).length;

  // Construire les données du graphique (7 jours)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split("T")[0];

    const daySales = (weekSales || [])
      .filter((s) => s.sold_at.startsWith(dayStr))
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);

    const dayExpenses = (weekExpenses || [])
      .filter((e) => e.spent_at.startsWith(dayStr))
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    chartData.push({ date: dayStr, ventes: daySales, depenses: dayExpenses });
  }

  // Activité récente (mélange ventes + dépenses triés par date)
  const recentActivity = [
    ...(salesResult.data || []).slice(0, 5).map((s) => ({
      type: "sale" as const,
      amount: s.total_amount,
      label: "Vente",
      date: s.sold_at,
      method: s.payment_method,
    })),
    ...(expensesResult.data || []).slice(0, 3).map((e) => ({
      type: "expense" as const,
      amount: e.amount,
      label: e.category_name || "Dépense",
      date: e.spent_at,
      description: e.description,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "là";

  return (
    <DashboardClient
      userName={userName}
      businessName={businessResult.data?.name || "Mon Commerce"}
      todaySales={todaySales}
      todayExpenses={todayExpenses}
      todayProfit={todayProfit}
      todaySalesCount={todaySalesCount}
      chartData={chartData}
      recentActivity={recentActivity}
      lowStockProducts={(productsResult.data || []).map(p => ({
        id: p.id,
        name: p.name,
        stock_quantity: p.stock_quantity,
        min_stock_alert: p.min_stock_alert,
      }))}
      activeDebts={(debtsResult.data || []).map(d => ({
        customer_name: d.customer_name,
        remaining_amount: d.remaining_amount,
        status: d.status,
      }))}
    />
  );
}

