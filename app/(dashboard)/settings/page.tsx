import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <SettingsClient
      user={{
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        bio: user.user_metadata?.bio || "",
      }}
      business={business || null}
    />
  );
}
