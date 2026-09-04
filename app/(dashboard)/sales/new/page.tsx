import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NewSaleForm from "./NewSaleForm";

export const metadata: Metadata = { title: "Nouvelle vente" };

export default async function NewSalePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
    <NewSaleForm
      products={products || []}
      customers={customers || []}
      userId={user.id}
    />
  );
}
