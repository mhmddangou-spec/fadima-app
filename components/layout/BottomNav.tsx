"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Plus, AlertCircle, MoreHorizontal, X,
  CreditCard, Users, Package, BarChart3, Settings, MessageSquare, Building2
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import { useState } from "react";

const FAB_ACTIONS = [
  { href: "/sales/new",  label: "Ajouter une vente",    textColor: "text-primary-600", bgLight: "bg-primary-50", icon: ShoppingBag },
  { href: "/expenses",   label: "Ajouter une depense",  textColor: "text-red-600",     bgLight: "bg-red-50",     icon: CreditCard },
  { href: "/debts",      label: "Ajouter une dette",    textColor: "text-amber-600",   bgLight: "bg-amber-50",   icon: Users },
  { href: "/products",   label: "Ajouter un produit",   textColor: "text-blue-600",    bgLight: "bg-blue-50",    icon: Package },
];

const MORE_ITEMS = [
  { href: "/profile",    label: "Mon Profil",    icon: Building2 },
  { href: "/products",   label: "Produits",      icon: Package },
  { href: "/customers",  label: "Clients",       icon: Users },
  { href: "/analytics",  label: "Statistiques",  icon: BarChart3 },
  { href: "/assistant",  label: "Assistant",     icon: MessageSquare },
  { href: "/settings",   label: "Parametres",    icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showFab, setShowFab] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const closeBoth = () => { setShowFab(false); setShowMore(false); };
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {(showFab || showMore) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={closeBoth} />
      )}

      {showFab && (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 items-end lg:hidden animate-slide-up">
          {FAB_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} onClick={closeBoth}
                className="fab-menu-item animate-pop-in"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", action.bgLight)}>
                  <Icon className={cn("w-4 h-4", action.textColor)} />
                </div>
                <span>{action.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {showMore && (
        <div className="fixed bottom-24 right-4 z-50 bg-white rounded-2xl shadow-elevated border border-gray-100 overflow-hidden animate-slide-up lg:hidden w-52">
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={closeBoth}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                <Icon className="w-4 h-4 text-gray-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      <nav className="bottom-nav">
        <Link href="/dashboard" onClick={closeBoth} className={cn("nav-item", isActive("/dashboard") && "active")}>
          <LayoutDashboard className={cn("w-5 h-5", isActive("/dashboard") ? "text-primary-600" : "text-gray-400")} />
          <span>Accueil</span>
        </Link>

        <Link href="/sales" onClick={closeBoth} className={cn("nav-item", isActive("/sales") && "active")}>
          <ShoppingBag className={cn("w-5 h-5", isActive("/sales") ? "text-primary-600" : "text-gray-400")} />
          <span>Ventes</span>
        </Link>

        <div className="flex flex-col items-center justify-center flex-1">
          <button onClick={() => { setShowFab(!showFab); setShowMore(false); }}
            className="flex flex-col items-center gap-1" aria-label="Actions rapides">
            <div className={cn("nav-item-add-new", showFab && "open")}>
              {showFab ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </div>
            <span className="text-xs font-medium text-primary-600 mt-1">Ajouter</span>
          </button>
        </div>

        <Link href="/debts" onClick={closeBoth} className={cn("nav-item", isActive("/debts") && "active")}>
          <AlertCircle className={cn("w-5 h-5", isActive("/debts") ? "text-primary-600" : "text-gray-400")} />
          <span>Dettes</span>
        </Link>

        <button onClick={() => { setShowMore(!showMore); setShowFab(false); }}
          className={cn("nav-item", showMore && "active")}>
          <MoreHorizontal className={cn("w-5 h-5", showMore ? "text-primary-600" : "text-gray-400")} />
          <span>Plus</span>
        </button>
      </nav>
    </>
  );
}
