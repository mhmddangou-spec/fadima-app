import { Toaster } from "react-hot-toast";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Récupérer les infos du business
  const { data: business } = (await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", user.id)
    .single()) as { data: any };

  const userName = user.user_metadata?.full_name || user.email || "";
  const userAvatar = user.user_metadata?.avatar_url || "";
  const businessName = business?.name || "Mon Commerce";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <Sidebar businessName={businessName} userName={userName} userAvatar={userAvatar} />

      {/* Contenu principal */}
      <main className="dashboard-content flex-1">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Navigation mobile */}
      <BottomNav />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontFamily: "var(--font-inter, system-ui, sans-serif)",
            fontSize: "0.9rem",
            fontWeight: "500",
          },
          success: {
            style: {
              background: "#1a6b4a",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#1a6b4a",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#ef4444",
            },
          },
        }}
      />
    </div>
  );
}
