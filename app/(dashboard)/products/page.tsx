// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = { title: "Produits & Stock" };

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name, color)")
    .eq("user_id", user.id)
    .order("name");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("type", "product")
    .order("name");

  return (
    <ProductsClient
      products={(products || []).map(p => ({
        ...p,
        margin: p.selling_price - p.purchase_price,
        category: p.categories as { name: string; color: string } | undefined,
      }))}
      categories={categories || []}
      userId={user.id}
    />
  );
}

