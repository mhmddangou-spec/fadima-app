"use client";

import Link from "next/link";
import { Check, Zap, Rocket, Lock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/format";

interface PlanCardsProps {
  currentPlan: string;
  operationsUsed: number;
  operationsLimit: number;
}

const FREE_FEATURES = [
  "Ventes & depenses",
  "Dettes clients",
  "Statistiques basiques",
  "Gestion de stock",
];

const PRO_FEATURES = [
  "Operations illimitees",
  "Rapports avances",
  "Export PDF & Excel",
  "Assistant intelligent",
  "Gestion avancee du stock",
  "Support prioritaire",
];

const BUSINESS_FEATURES = [
  "Plusieurs utilisateurs",
  "Rapports avances",
  "API d'integration",
  "Support dedie",
  "Gestion multi-boutiques",
];

export default function PlanCards({ currentPlan, operationsUsed, operationsLimit }: PlanCardsProps) {
  const pct = operationsLimit > 0 ? Math.round((operationsUsed / operationsLimit) * 100) : 0;
  const isNearLimit = pct >= 80 && pct < 100;
  const isAtLimit = pct >= 100;

  const fillClass = isAtLimit
    ? "progress-bar-fill-danger"
    : isNearLimit
    ? "progress-bar-fill-warning"
    : "progress-bar-fill";

  return (
    <section className="space-y-4 animate-fade-up delay-500">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Mes Plans & Offres</h2>
        <span className="text-xs text-gray-400 font-medium">Choisissez votre plan</span>
      </div>

      <div className="cards-scroll lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0">

        {/* PLAN GRATUIT */}
        <div className={cn("plan-card w-72 lg:w-auto", currentPlan === "free" && "border-primary-400")}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Plan actuel</p>
              <h3 className="text-lg font-bold text-gray-900 mt-0.5">Plan Gratuit</h3>
            </div>
            {currentPlan === "free" && (
              <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
                Actuel
              </span>
            )}
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-gray-900">0</span>
            <span className="text-lg font-bold text-gray-500 mb-0.5">FCFA</span>
            <span className="text-sm text-gray-400 mb-1">/mois</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className={isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-gray-600"}>
                {operationsUsed} / {operationsLimit} operations
              </span>
              <span className={isAtLimit ? "text-red-600 font-bold" : "text-gray-400"}>{pct}%</span>
            </div>
            <div className="progress-bar">
              <div className={fillClass} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            {isAtLimit && <p className="text-xs text-red-600 font-medium">Limite mensuelle atteinte</p>}
            {isNearLimit && !isAtLimit && <p className="text-xs text-amber-600 font-medium">Vous approchez de votre limite</p>}
          </div>

          <ul className="space-y-1.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <Link href="/settings" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-all">
            Gerer mon plan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* FADIMA PRO */}
        <div className="plan-card plan-card-pro w-72 lg:w-auto">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1 px-3 py-1 gradient-gold-subtle text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
              <Sparkles className="w-3 h-3" />
              RECOMMANDE
            </span>
          </div>

          <div className="flex items-start justify-between pt-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Premium</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-0.5">FADIMA Pro</h3>
            </div>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-gray-900">2 500</span>
            <span className="text-lg font-bold text-gray-500 mb-0.5">FCFA</span>
            <span className="text-sm text-gray-400 mb-1">/mois</span>
          </div>

          <ul className="space-y-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-yellow-600" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => alert("Fonctionnalite bientot disponible !")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #c9a227 0%, #a6811b 100%)" }}
          >
            <Zap className="w-4 h-4" />
            Passer a Pro
          </button>
        </div>

        {/* FADIMA BUSINESS */}
        <div className="plan-card plan-card-coming w-72 lg:w-auto">
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">A VENIR</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Enterprise</span>
              </div>
              <h3 className="text-lg font-bold text-gray-500 mt-0.5">FADIMA Business</h3>
            </div>
          </div>

          <p className="text-sm text-gray-400 italic">Pour developper votre entreprise</p>

          <ul className="space-y-1.5">
            {BUSINESS_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => alert("Nous vous informerons des que ce plan sera disponible !")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all mt-auto"
          >
            Etre informe
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
