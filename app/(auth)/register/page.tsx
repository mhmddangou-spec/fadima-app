// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const ACTIVITIES = [
  "Vente de vêtements",
  "Vente de chaussures",
  "Restaurant / Alimentation",
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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: compte, 2: business

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    activity: "",
    city: "",
    business_name: "",
  });

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.activity || !form.city) {
      setError("Veuillez sélectionner votre activité et votre ville.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Email par défaut si non fourni (phone@fadima.app)
      const email = form.email || `${form.phone.replace(/\s/g, "").replace("+", "")}@fadima.app`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            phone: form.phone,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Ce compte existe déjà. Connectez-vous.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        // Créer le business
        const businessName = form.business_name || `${form.full_name} Commerce`;
        await supabase.from("businesses").insert({
          user_id: data.user.id,
          name: businessName,
          activity: form.activity,
          city: form.city,
          phone: form.phone,
          email: form.email || undefined,
          plan: "free",
        });

        // Créer les catégories de dépenses par défaut
        const defaultExpenseCategories = [
          { name: "Transport", type: "expense" as const, color: "#f59e0b" },
          { name: "Achat marchandises", type: "expense" as const, color: "#6366f1" },
          { name: "Loyer", type: "expense" as const, color: "#ef4444" },
          { name: "Communication", type: "expense" as const, color: "#8b5cf6" },
          { name: "Salaire", type: "expense" as const, color: "#10b981" },
          { name: "Nourriture", type: "expense" as const, color: "#f97316" },
          { name: "Électricité", type: "expense" as const, color: "#eab308" },
          { name: "Internet", type: "expense" as const, color: "#06b6d4" },
          { name: "Autre", type: "expense" as const, color: "#6b7280" },
        ].map((c) => ({ ...c, user_id: data.user!.id, is_default: true }));

        await supabase.from("categories").insert(defaultExpenseCategories);
      }

      toast.success("Compte créé avec succès ! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-white rounded-2xl shadow-elevated p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {step === 1 ? "Créer votre compte 🚀" : "Votre business 🏪"}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1 ? "Étape 1 sur 2 — Informations personnelles" : "Étape 2 sur 2 — Votre activité"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1.5 rounded-full bg-primary-600" />
          <div className={`flex-1 h-1.5 rounded-full ${step === 2 ? "bg-primary-600" : "bg-gray-200"} transition-colors`} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-6 border border-red-100 animate-fade-in">
            {error}
          </div>
        )}

        {/* Step 1: Compte */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="input-label">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                className="input"
                placeholder="Ex: Mariam Koné"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="input-label">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="+229 97 00 00 00"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="input-label">
                Email <span className="text-gray-400 text-xs">(facultatif)</span>
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="votre@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input pr-12"
                  placeholder="Au moins 6 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center text-base mt-2">
              Continuer
              <Check className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Step 2: Business */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="business_name" className="input-label">
                Nom de votre business <span className="text-gray-400 text-xs">(facultatif)</span>
              </label>
              <input
                id="business_name"
                type="text"
                className="input"
                placeholder={`${form.full_name || "Votre"} Commerce`}
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="activity" className="input-label">
                Votre activité <span className="text-red-500">*</span>
              </label>
              <select
                id="activity"
                className="select"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
                required
              >
                <option value="">Choisir une activité...</option>
                {ACTIVITIES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="input-label">
                Votre ville <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                className="select"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              >
                <option value="">Choisir une ville...</option>
                {CITIES_BENIN.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline flex-1 justify-center"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

