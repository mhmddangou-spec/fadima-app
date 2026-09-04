// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = { title: "Statistiques" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Récupérer 30 jours de données par défaut
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [salesResult, expensesResult, topProductsResult] = await Promise.all([
    supabase
      .from("sales")
      .select("total_amount, sold_at, payment_method")
      .eq("user_id", user.id)
      .gte("sold_at", thirtyDaysAgo.toISOString())
      .order("sold_at", { ascending: true }),

    supabase
      .from("expenses")
      .select("amount, spent_at, category_name")
      .eq("user_id", user.id)
      .gte("spent_at", thirtyDaysAgo.toISOString())
      .order("spent_at", { ascending: true }),

    // Top produits : agréger les sale_items
    supabase
      .from("sale_items")
      .select("product_name, quantity, total_price")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString()),
  ]);

  // Agréger les top produits
  const productMap = new Map<string, { revenue: number; qty: number }>();
  for (const item of topProductsResult.data || []) {
    const existing = productMap.get(item.product_name) || { revenue: 0, qty: 0 };
    productMap.set(item.product_name, {
      revenue: existing.revenue + item.total_price,
      qty: existing.qty + item.quantity,
    });
  }
  const topProducts = Array.from(productMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Agréger par dépense catégorie
  const categoryMap = new Map<string, number>();
  for (const exp of expensesResult.data || []) {
    const cat = exp.category_name || "Autre";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + exp.amount);
  }
  const expensesByCategory = Array.from(categoryMap.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  // Données du graphique (30 jours)
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split("T")[0];

    const daySales = (salesResult.data || [])
      .filter((s) => s.sold_at.startsWith(dayStr))
      .reduce((sum, s) => sum + s.total_amount, 0);

    const dayExpenses = (expensesResult.data || [])
      .filter((e) => e.spent_at.startsWith(dayStr))
      .reduce((sum, e) => sum + e.amount, 0);

    chartData.push({ date: dayStr, ventes: daySales, depenses: dayExpenses });
  }

  const totalSales = (salesResult.data || []).reduce((sum, s) => sum + s.total_amount, 0);
  const totalExpenses = (expensesResult.data || []).reduce((sum, e) => sum + e.amount, 0);
  const salesCount = (salesResult.data || []).length;
  const avgBasket = salesCount > 0 ? totalSales / salesCount : 0;

  return (
    <AnalyticsClient
      totalSales={totalSales}
      totalExpenses={totalExpenses}
      salesCount={salesCount}
      avgBasket={avgBasket}
      profit={totalSales - totalExpenses}
      chartData={chartData}
      topProducts={topProducts}
      expensesByCategory={expensesByCategory}
    />
  );
}

