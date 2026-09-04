import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ExpensesClient from "./ExpensesClient";

export const metadata: Metadata = { title: "Dépenses" };

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, amount, category_name, description, payment_method, spent_at")
    .eq("user_id", user.id)
    .order("spent_at", { ascending: false })
    .limit(50);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .order("name");

  return (
    <ExpensesClient
      expenses={expenses || []}
      categories={categories || []}
      userId={user.id}
    />
  );
}
