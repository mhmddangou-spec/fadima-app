import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SalesClient from "./SalesClient";

export const metadata: Metadata = { title: "Ventes" };

export default async function SalesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sales } = await supabase
    .from("sales")
    .select(`
      id, total_amount, paid_amount, payment_method, payment_status, 
      sold_at, notes, discount_amount,
      customers(name, phone),
      sale_items(product_name, quantity, unit_price, total_price)
    `)
    .eq("user_id", user.id)
    .order("sold_at", { ascending: false })
    .limit(50);

  const { data: products } = await supabase
    .from("products")
    .select("id, name, selling_price, stock_quantity")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("name");

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone")
    .eq("user_id", user.id)
    .order("name");

  return (
    <SalesClient
      sales={sales || []}
      products={products || []}
      customers={customers || []}
      userId={user.id}
    />
  );
}
