// ============================================================
// FADIMA — Utilitaires de formatage FCFA et dates
// ============================================================

/**
 * Formate un montant en FCFA
 * Ex: 15000 → "15 000 FCFA"
 */
export function formatCFA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Formate un montant court (pour les cartes)
 * Ex: 1500000 → "1,5M FCFA" ou 15000 → "15k FCFA"
 */
export function formatCFAShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace('.0', '')}M FCFA`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k FCFA`;
  }
  return `${amount} FCFA`;
}

/**
 * Formate une date en français
 * Ex: "2024-01-15" → "15 janvier 2024"
 */
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une date courte
 * Ex: "2024-01-15" → "15 janv. 2024"
 */
export function formatDateShort(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Temps relatif
 * Ex: "il y a 2 heures"
 */
export function formatRelative(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  return formatDateShort(date);
}

/**
 * Date du début de la journée
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Date du début du mois
 */
export function startOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Génère les 7 derniers jours pour le graphique
 */
export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

/**
 * Label court pour le graphique
 * Ex: "2024-01-15" → "Lun 15"
 */
export function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Calcule le pourcentage de variation
 */
export function calcVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Classe CSS conditionnelle
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formate le statut de paiement en français
 */
export function formatPaymentStatus(status: string): string {
  const map: Record<string, string> = {
    paid: 'Payé',
    partial: 'Partiellement payé',
    unpaid: 'À payer',
  };
  return map[status] || status;
}

/**
 * Formate le mode de paiement en français
 */
export function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    cash: 'Espèces',
    mobile_money: 'Mobile Money',
    other: 'Autre',
    credit: 'Crédit',
  };
  return map[method] || method;
}

/**
 * Couleur du statut
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    paid: 'text-success bg-success/10',
    partial: 'text-warning bg-warning/10',
    unpaid: 'text-danger bg-danger/10',
  };
  return map[status] || 'text-muted bg-gray-100';
}

/**
 * Génère un numéro de vente unique
 */
export function generateSaleNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `VTE-${year}${month}${day}-${random}`;
}
