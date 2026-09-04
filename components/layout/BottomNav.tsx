"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Plus, AlertCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { useState } from "react";

const mainNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Accueil" },
  { href: "/sales/new", icon: ShoppingBag, label: "Vendre" },
  { href: "/debts", icon: AlertCircle, label: "Dettes" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Overlay menu */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* More menu */}
      {showMenu && (
        <div className="fixed bottom-20 right-3 z-50 bg-white rounded-2xl shadow-elevated border border-gray-100 overflow-hidden animate-slide-up lg:hidden">
          {[
            { href: "/products", label: "Produits" },
            { href: "/customers", label: "Clients" },
            { href: "/analytics", label: "Statistiques" },
            { href: "/assistant", label: "Assistant" },
            { href: "/settings", label: "Paramètres" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {mainNav.map((item, i) => {
          // Bouton central (ajouter)
          if (i === 1) {
            return (
              <div key="add" className="flex flex-col items-center justify-center flex-1">
                <Link href="/sales/new" className="flex flex-col items-center gap-1">
                  <div className="nav-item-add">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-primary-600 mt-1">Ajouter</span>
                </Link>
              </div>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "active")}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-primary-600" : "text-gray-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Plus */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn("nav-item", showMenu && "active")}
        >
          <MoreHorizontal className={cn("w-6 h-6", showMenu ? "text-primary-600" : "text-gray-400")} />
          <span>Plus</span>
        </button>
      </nav>
    </>
  );
}
