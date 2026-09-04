"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Users,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  TrendingUp,
  LogOut,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/sales", icon: ShoppingBag, label: "Ventes" },
  { href: "/expenses", icon: CreditCard, label: "Dépenses" },
  { href: "/debts", icon: AlertCircle, label: "Dettes" },
  { href: "/products", icon: Package, label: "Produits" },
  { href: "/customers", icon: Users, label: "Clients" },
  { href: "/analytics", icon: BarChart3, label: "Statistiques" },
  { href: "/assistant", icon: MessageSquare, label: "Assistant" },
];

interface SidebarProps {
  businessName?: string;
  userName?: string;
  userAvatar?: string;
}

export default function Sidebar({ businessName, userName, userAvatar }: SidebarProps) {
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

  return (
    <aside className="dashboard-sidebar">
      {/* Logo + Brand */}
      <div className="p-5 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">FADIMA</span>
            <p className="text-xs text-gray-400 leading-none">Ton business</p>
          </div>
        </Link>
      </div>

      {/* Business info */}
      {businessName && (
        <div className="px-4 py-3 mx-3 mt-3 bg-primary-50 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{businessName}</p>
              {userName && <p className="text-xs text-gray-500 truncate">{userName}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-50 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <Settings className="w-5 h-5" />
          Paramètres
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
