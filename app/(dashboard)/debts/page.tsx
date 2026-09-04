import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import DebtsClient from "./DebtsClient";

export const metadata: Metadata = { title: "Dettes clients" };

export default async function DebtsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: debts } = await supabase
    .from("debts")
    .select(`
      id, customer_name, initial_amount, paid_amount, remaining_amount,
      due_date, status, notes, created_at,
      customers(id, name, phone)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone")
    .eq("user_id", user.id)
    .order("name");

  return (
    <DebtsClient
      debts={debts || []}
      customers={customers || []}
      userId={user.id}
    />
  );
}
