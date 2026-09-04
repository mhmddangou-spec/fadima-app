// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Building2, Shield, HelpCircle, LogOut,
  ChevronRight, Loader2, Check, Bell, Moon, Globe,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  bio?: string;
}

interface Business {
  id: string;
  name: string;
  activity?: string;
  city?: string;
  phone?: string;
  plan: string;
}

interface SettingsClientProps {
  user: UserProfile;
  business: Business | null;
}

const BUSINESS_ACTIVITIES = [
  "Restauration / Alimentation",
  "Coiffure / Beauté",
  "Couture / Mode",
  "Boutique générale",
  "Téléphonie / Informatique",
  "Freelance / Services",
  "Agriculture / Maraîchage",
  "Artisanat",
  "Autre",
];

const CITIES_BENIN = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey-Calavi",
  "Bohicon",
  "Natitingou",
  "Ouidah",
  "Lokossa",
  "Kandi",
  "Djougou",
  "Autre",
];

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: "Gratuit", color: "bg-gray-100 text-gray-700" },
  starter: { label: "Starter", color: "bg-blue-100 text-blue-700" },
  pro: { label: "Pro", color: "bg-amber-100 text-amber-700" },
};

export default function SettingsClient({ user, business }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "business" | null>(null);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const plan = business?.plan || "free";
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm">Gérez votre compte et votre business</p>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 flex items-center gap-4">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" />
          ) : (
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xl font-bold">
                {user.full_name ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
              </span>
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900 text-lg">{user.full_name || "Utilisateur"}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>
              Plan {planInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Raccourci vers Mon Profil */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => router.push('/profile')}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-900 block">Profil Pro & Identité</span>
              <span className="text-xs text-gray-500">Gérer mes informations professionnelles publiques</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Plan actuel */}
      {plan === "free" && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Passez au plan Pro</h3>
              <p className="text-amber-700 text-sm mb-3">Débloquez les rapports avancés, l'export PDF et bien plus encore.</p>
              <button className="bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors">
                Voir les offres →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Autres options */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {[
          { icon: Shield, label: "Confidentialité & Sécurité", color: "bg-green-50 text-green-600" },
          { icon: Bell, label: "Notifications", color: "bg-purple-50 text-purple-600" },
          { icon: HelpCircle, label: "Aide & Support", color: "bg-blue-50 text-blue-600" },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Déconnexion */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 font-semibold hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Se déconnecter
      </button>

      <p className="text-center text-xs text-gray-400 pb-4">
        FADIMA v1.0.0 — Fait avec ❤️ pour les commerçants africains
      </p>
    </div>
  );
}

