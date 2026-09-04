// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AssistantClient from "./AssistantClient";

export const metadata: Metadata = { title: "Assistant FADIMA" };

export default async function AssistantPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // PrÃ©-charger les statistiques pour le contexte de l'assistant
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [todaySalesResult, weekSalesResult, monthSalesResult, debtsResult, productsResult] = await Promise.all([
    supabase.from("sales").select("total_amount").eq("user_id", user.id).gte("sold_at", `${today}T00:00:00`),
    supabase.from("sales").select("total_amount, sold_at").eq("user_id", user.id).gte("sold_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("sales").select("total_amount").eq("user_id", user.id).gte("sold_at", monthStart.toISOString()),
    supabase.from("debts").select("customer_name, remaining_amount").eq("user_id", user.id).in("status", ["unpaid", "partial"]),
    supabase.from("products").select("name, stock_quantity, min_stock_alert").eq("user_id", user.id).eq("is_active", true),
  ]);

  const [todayExpResult, weekExpResult] = await Promise.all([
    supabase.from("expenses").select("amount").eq("user_id", user.id).gte("spent_at", `${today}T00:00:00`),
    supabase.from("expenses").select("amount").eq("user_id", user.id).gte("spent_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const context = {
    todaySales: (todaySalesResult.data || []).reduce((s, r) => s + r.total_amount, 0),
    todayExpenses: (todayExpResult.data || []).reduce((s, r) => s + r.amount, 0),
    weekSales: (weekSalesResult.data || []).reduce((s, r) => s + r.total_amount, 0),
    weekExpenses: (weekExpResult.data || []).reduce((s, r) => s + r.amount, 0),
    monthSales: (monthSalesResult.data || []).reduce((s, r) => s + r.total_amount, 0),
    activeDebts: (debtsResult.data || []).map((d) => ({ name: d.customer_name, amount: d.remaining_amount })),
    totalDebt: (debtsResult.data || []).reduce((s, r) => s + r.remaining_amount, 0),
    lowStockProducts: (productsResult.data || []).filter((p) => p.stock_quantity <= p.min_stock_alert).map((p) => p.name),
  };

  return <AssistantClient context={context} userId={user.id} />;
}

