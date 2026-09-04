import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Package,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
  Smartphone,
  Shield,
  Zap,
  Users,
  Scissors,
  UtensilsCrossed,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FADIMA — Gérez votre business sans calculatrice",
  description:
    "FADIMA transforme vos ventes, dépenses et dettes en informations simples pour vous aider à mieux piloter votre activité. Conçu pour les commerçants du Bénin.",
};

const features = [
  {
    icon: ShoppingBag,
    title: "Ventes",
    description: "Enregistrez chaque vente en 10 secondes. Calcul automatique du total.",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: CreditCard,
    title: "Dépenses",
    description: "Catégorisez et suivez toutes vos dépenses facilement.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Users,
    title: "Dettes clients",
    description: "Sachez toujours qui vous doit de l'argent et combien.",
    color: "bg-orange-50 text-orange-700",
  },
  {
    icon: Package,
    title: "Stock",
    description: "Alertes automatiques quand vos produits sont presque épuisés.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: BarChart3,
    title: "Statistiques",
    description: "Visualisez votre chiffre d'affaires, marges et meilleures ventes.",
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    icon: MessageSquare,
    title: "Assistant intelligent",
    description: "Posez vos questions en français naturel. FADIMA répond avec vos chiffres.",
    color: "bg-pink-50 text-pink-700",
  },
];

const forWho = [
  { icon: ShoppingBag, label: "Boutiques vêtements" },
  { icon: ShoppingBag, label: "Vendeurs chaussures" },
  { icon: Smartphone, label: "Boutiques WhatsApp" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Scissors, label: "Coiffeuses & coiffeurs" },
  { icon: Scissors, label: "Couturiers" },
  { icon: Users, label: "Freelances" },
  { icon: ShoppingBag, label: "Petits commerces" },
];

const faq = [
  {
    q: "Est-ce que je dois connaître la comptabilité ?",
    a: "Non ! FADIMA est conçu pour les commerçants, pas pour les comptables. Si vous savez vendre, vous savez utiliser FADIMA.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Vos données sont stockées de façon sécurisée et seul vous pouvez y accéder. Aucun autre utilisateur ne peut voir vos informations.",
  },
  {
    q: "Est-ce que ça marche sans connexion internet ?",
    a: "La version MVP nécessite une connexion. La version hors-ligne est prévue pour une prochaine mise à jour.",
  },
  {
    q: "Comment enregistrer une vente ?",
    a: "Cliquez sur '+ Vente', entrez le produit, la quantité et le prix. C'est tout ! Le total est calculé automatiquement.",
  },
  {
    q: "Puis-je exporter mes données ?",
    a: "L'export est disponible dans le plan Pro. Vous pouvez exporter en PDF ou Excel.",
  },
  {
    q: "Le plan gratuit est-il vraiment gratuit ?",
    a: "Oui ! Le plan Free vous donne 30 opérations par mois sans aucune carte bancaire.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FADIMA</span>
            </div>

            {/* Nav links desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">
                Fonctionnalités
              </a>
              <a href="#pour-qui" className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">
                Pour qui ?
              </a>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">
                Tarifs
              </Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-4 py-2 min-h-0 h-10"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gold-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full opacity-30 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-100 rounded-full opacity-40 -translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-100">
                <Zap className="w-4 h-4" />
                Conçu pour le Bénin 🇧🇯
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Gérez votre business{" "}
                <span className="text-primary-600">sans calculatrice.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                FADIMA transforme vos ventes, dépenses et dettes en informations
                simples pour vous aider à{" "}
                <strong>mieux piloter votre activité.</strong>
              </p>

              {/* Slogan */}
              <p className="text-primary-600 font-bold text-lg mb-8">
                « Ton business. Ta voix. Tes chiffres. »
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="btn-primary text-base px-8 py-4 min-h-0">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#comment-ca-marche" className="btn-secondary text-base px-8 py-4 min-h-0">
                  Voir comment ça marche
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span>Gratuit pour démarrer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span>Aucune carte bancaire</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span>100% en français</span>
                </div>
              </div>
            </div>

            {/* Dashboard preview card */}
            <div className="flex-1 w-full max-w-md lg:max-w-none animate-fade-in">
              <div className="relative">
                {/* Phone frame */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 max-w-sm mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-gray-500">Bonjour, Mariam 👋</p>
                      <p className="font-bold text-gray-900">Mariam Fashion</p>
                    </div>
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MF</span>
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-primary-50 rounded-xl p-3">
                      <p className="text-xs text-primary-600 font-medium">Ventes auj.</p>
                      <p className="text-lg font-bold text-primary-700 mt-1">42 500 FCFA</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3">
                      <p className="text-xs text-red-600 font-medium">Dépenses</p>
                      <p className="text-lg font-bold text-red-700 mt-1">8 000 FCFA</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3">
                      <p className="text-xs text-yellow-600 font-medium">Résultat</p>
                      <p className="text-lg font-bold text-yellow-700 mt-1">34 500 FCFA</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-600 font-medium">Ventes</p>
                      <p className="text-lg font-bold text-blue-700 mt-1">5 opérations</p>
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Activité récente</p>
                    {[
                      { type: "Vente", item: "Chaussures × 2", amount: "+30 000", color: "text-green-600" },
                      { type: "Dépense", item: "Transport marché", amount: "-2 000", color: "text-red-600" },
                      { type: "Vente", item: "Robe wax", amount: "+12 500", color: "text-green-600" },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-xs text-gray-500">{tx.type}</p>
                          <p className="text-sm font-medium text-gray-800">{tx.item}</p>
                        </div>
                        <span className={`text-sm font-bold ${tx.color}`}>{tx.amount} FCFA</span>
                      </div>
                    ))}
                  </div>

                  {/* Add button */}
                  <button className="w-full btn-primary mt-4 justify-center">
                    + Ajouter une opération
                  </button>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Vente enregistrée ✓</p>
                      <p className="text-xs text-gray-500">15 000 FCFA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="comment-ca-marche" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trois étapes simples pour gérer votre business comme un pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: ShoppingBag,
                title: "J'enregistre",
                description: "Saisissez vos ventes, dépenses ou dettes en quelques secondes. Pas besoin de connaître la comptabilité.",
                color: "bg-primary-600",
              },
              {
                step: "2",
                icon: BarChart3,
                title: "FADIMA calcule",
                description: "L'application fait tous les calculs automatiquement. Totaux, marges, résultats. Vous n'avez rien à faire.",
                color: "bg-gold-500",
              },
              {
                step: "3",
                icon: TrendingUp,
                title: "Je comprends mon business",
                description: "Voyez immédiatement combien vous avez gagné, dépensé, et ce qui se vend le mieux.",
                color: "bg-blue-600",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-2/3 w-2/3 h-0.5 bg-gray-100 z-0" />
                )}
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-10 h-10 text-white" />
                    <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${item.color} border-2 border-white flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR QUI ── */}
      <section id="pour-qui" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pour qui ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              FADIMA est fait pour tous les petits commerçants qui veulent gérer leur activité simplement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {forWho.map((item, i) => (
              <div
                key={i}
                className="card text-center hover:border-primary-200 hover:bg-primary-50 transition-all duration-300 cursor-default group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-600 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ── */}
      <section id="fonctionnalites" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tout ce qu'il faut pour piloter votre business au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="card group hover:shadow-card-hover transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-gray-600 text-lg">
              Commencez gratuitement, évoluez quand vous êtes prêt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="card border-2 border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Free</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">0</span>
                  <span className="text-gray-500 text-sm">FCFA / mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {["30 opérations / mois", "Ventes", "Dépenses", "Dettes", "Statistiques basiques"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-outline w-full justify-center">
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="card border-2 border-primary-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                POPULAIRE
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary-600">2 500</span>
                  <span className="text-gray-500 text-sm">FCFA / mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Opérations illimitées",
                  "Gestion stock",
                  "Clients",
                  "Statistiques avancées",
                  "Export PDF / Excel",
                  "Assistant intelligent",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary w-full justify-center">
                Essayer Pro
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Business */}
            <div className="card border-2 border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Business</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">Bientôt</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tout du plan Pro",
                  "Plusieurs utilisateurs",
                  "Rapports avancés",
                  "Support prioritaire",
                  "API d'intégration",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="btn-outline w-full justify-center opacity-50 cursor-not-allowed">
                Bientôt disponible
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            * Intégration Mobile Money prévue. Pas de paiement requis pour démarrer.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="card border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-700 text-xs font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à gérer votre business simplement ?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les commerçants qui utilisent FADIMA pour mieux comprendre et piloter leur activité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FADIMA</span>
              </div>
              <p className="text-sm leading-relaxed mb-4 max-w-xs">
                Ton business. Ta voix. Tes chiffres. Conçu pour les commerçants africains.
              </p>
              <div className="flex gap-3">
                <span className="text-lg">🇧🇯</span>
                <span className="text-lg">🇸🇳</span>
                <span className="text-lg">🇨🇮</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Régions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/benin" className="hover:text-white transition-colors">Bénin</Link></li>
                <li><Link href="/senegal" className="hover:text-white transition-colors">Sénégal</Link></li>
                <li><Link href="/cote-divoire" className="hover:text-white transition-colors">Côte d'Ivoire</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} FADIMA. Tous droits réservés.</p>
            <p className="text-sm flex items-center gap-1">
              Fait avec <span className="text-red-400">❤️</span> pour l'Afrique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
