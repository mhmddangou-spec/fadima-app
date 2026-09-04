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

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: "Gratuit", color: "bg-gray-100 text-gray-700" },
  starter: { label: "Starter", color: "bg-blue-100 text-blue-700" },
  pro: { label: "Pro", color: "bg-amber-100 text-amber-700" },
};

export default function SettingsClient({ user, business }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "business" | null>(null);

  const [profileForm, setProfileForm] = useState({
    full_name: user.full_name,
    phone: user.phone,
  });

  const [businessForm, setBusinessForm] = useState({
    name: business?.name || "",
    activity: business?.activity || "",
    city: business?.city || "",
    phone: business?.phone || "",
  });

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          full_name: profileForm.full_name,
          phone: profileForm.phone,
        },
      });
      toast.success("Profil mis Ã  jour âœ“");
      setActiveSection(null);
    } catch {
      toast.error("Erreur lors de la mise Ã  jour.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    if (!business) return;
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("businesses").update({
        name: businessForm.name,
        activity: businessForm.activity,
        city: businessForm.city,
        phone: businessForm.phone,
      }).eq("id", business.id);
      toast.success("Business mis Ã  jour âœ“");
      setActiveSection(null);
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise Ã  jour.");
    } finally {
      setLoading(false);
    }
  };

  const plan = business?.plan || "free";
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.free;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ParamÃ¨tres</h1>
        <p className="text-gray-500 text-sm">GÃ©rez votre compte et votre business</p>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user.full_name ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user.full_name || "Utilisateur"}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>
              Plan {planInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Section Profil */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setActiveSection(activeSection === "profile" ? null : "profile")}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Mon profil</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === "profile" ? "rotate-90" : ""}`} />
        </button>

        {activeSection === "profile" && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
            <div className="pt-4">
              <label className="input-label">Nom complet</label>
              <input type="text" className="input" value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
            </div>
            <div>
              <label className="input-label">TÃ©lÃ©phone</label>
              <input type="tel" className="input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input type="email" className="input" value={user.email} disabled className="input bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <button onClick={handleSaveProfile} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sauvegarde...</> : <><Check className="w-5 h-5" />Sauvegarder</>}
            </button>
          </div>
        )}
      </div>

      {/* Section Business */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setActiveSection(activeSection === "business" ? null : "business")}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-900 block">{business?.name || "Mon Business"}</span>
              <span className="text-xs text-gray-500">{business?.activity || ""}</span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === "business" ? "rotate-90" : ""}`} />
        </button>

        {activeSection === "business" && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
            <div className="pt-4">
              <label className="input-label">Nom du business</label>
              <input type="text" className="input" value={businessForm.name} onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })} />
            </div>
            <div>
              <label className="input-label">ActivitÃ©</label>
              <input type="text" className="input" value={businessForm.activity} onChange={(e) => setBusinessForm({ ...businessForm, activity: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">Ville</label>
                <input type="text" className="input" value={businessForm.city} onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })} />
              </div>
              <div>
                <label className="input-label">TÃ©lÃ©phone</label>
                <input type="tel" className="input" value={businessForm.phone} onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })} />
              </div>
            </div>
            <button onClick={handleSaveBusiness} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sauvegarde...</> : <><Check className="w-5 h-5" />Sauvegarder</>}
            </button>
          </div>
        )}
      </div>

      {/* Plan actuel */}
      {plan === "free" && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">ðŸš€</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Passez au plan Pro</h3>
              <p className="text-amber-700 text-sm mb-3">DÃ©bloquez les rapports avancÃ©s, l'export PDF et bien plus encore.</p>
              <button className="bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors">
                Voir les offres â†’
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Autres options */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {[
          { icon: Shield, label: "ConfidentialitÃ© & SÃ©curitÃ©", color: "bg-green-50 text-green-600" },
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

      {/* DÃ©connexion */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 font-semibold hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Se dÃ©connecter
      </button>

      <p className="text-center text-xs text-gray-400 pb-4">
        FADIMA v1.0.0 â€” Fait avec â¤ï¸ pour les commerÃ§ants africains
      </p>
    </div>
  );
}

