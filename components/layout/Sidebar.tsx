"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, CreditCard, Users, Package,
  BarChart3, MessageSquare, Settings, TrendingUp, LogOut,
  ChevronRight, AlertCircle, Zap, Bell, Building2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/sales",      icon: ShoppingBag,     label: "Ventes" },
  { href: "/expenses",   icon: CreditCard,      label: "Depenses" },
  { href: "/debts",      icon: AlertCircle,     label: "Dettes" },
  { href: "/products",   icon: Package,         label: "Produits" },
  { href: "/customers",  icon: Users,           label: "Clients" },
  { href: "/analytics",  icon: BarChart3,       label: "Statistiques" },
  { href: "/assistant",  icon: MessageSquare,   label: "Assistant" },
];

interface SidebarProps {
  businessName?: string;
  userName?: string;
  userAvatar?: string;
  plan?: string;
}

export default function Sidebar({ businessName, userName, userAvatar, plan = "free" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = businessName
    ? businessName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const userInitials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <div className="p-5 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">FADIMA</span>
            <p className="text-xs text-gray-400 leading-none">Ton business. Ta voix.</p>
          </div>
        </Link>
      </div>

      {/* Business info */}
      {businessName && (
        <div className="px-4 py-3 mx-3 mt-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold">{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{businessName}</p>
              {userName && <p className="text-xs text-gray-500 truncate">{userName}</p>}
            </div>
            <Bell className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-pointer hover:text-gray-500 transition-colors" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isAct = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isAct
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 flex-shrink-0", !isAct && "group-hover:scale-110 transition-transform duration-200")} style={{ width: "1.125rem", height: "1.125rem" }} />
              <span className="flex-1">{item.label}</span>
              {isAct && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner (free plan) */}
      {plan === "free" && (
        <div className="mx-3 mb-3 p-3.5 rounded-xl" style={{ background: "linear-gradient(135deg, #c9a227 0%, #a6811b 100%)" }}>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">Passez a Pro</p>
              <p className="text-white/80 text-xs leading-tight mt-0.5">Debloquez tout le potentiel de FADIMA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert("Fonctionnalite bientot disponible !")}
            className="mt-2.5 w-full py-2 text-xs font-bold bg-white text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            Decouvrir Pro
          </button>
        </div>
      )}

      {/* Bottom */}
      <div className="p-3 border-t border-gray-50 space-y-0.5">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/profile" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Building2 className="w-4.5 h-4.5 flex-shrink-0" style={{ width: "1.125rem", height: "1.125rem" }} />
          Mon Profil
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/settings" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Settings className="w-4.5 h-4.5 flex-shrink-0" style={{ width: "1.125rem", height: "1.125rem" }} />
          Parametres
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
