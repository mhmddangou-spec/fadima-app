// ============================================================
// FADIMA — Parser conversationnel (mode "Écrire simplement")
// Analyse les expressions naturelles en français sans API IA
// ============================================================

import { ParsedOperation, ParsedOperationType } from '@/types';

// Dictionnaire des produits courants
const KNOWN_PRODUCTS = [
  'pantalon', 'pantalons', 'chemise', 'chemises', 'robe', 'robes',
  'chaussure', 'chaussures', 'basket', 'baskets', 'sac', 'sacs',
  'pagne', 'pagnes', 'tissu', 'tissus', 'vêtement', 'vêtements',
  'accessoire', 'accessoires', 'jean', 'jeans', 'veste', 'vestes',
  't-shirt', 't-shirts', 'jupe', 'jupes', 'manteau', 'manteaux',
];

// Dictionnaire des catégories de dépenses
const EXPENSE_KEYWORDS = [
  'transport', 'loyer', 'électricité', 'eau', 'internet', 'téléphone',
  'salaire', 'nourriture', 'carburant', 'marchandise', 'stock',
  'réparation', 'fournitures', 'publicité', 'commission', 'taxe',
  'communication', 'achat',
];

// Mots qui indiquent une vente
const SALE_PATTERNS = [
  /j'ai vendu\s+(\d+)\s+(.+?)\s+à\s+(\d[\d\s]*)/i,
  /vendu\s+(\d+)\s+(.+?)\s+à\s+(\d[\d\s]*)/i,
  /vente\s+(\d+)\s+(.+?)\s+(\d[\d\s]*)/i,
  /(\d+)\s+(.+?)\s+vendu[es]?\s+à\s+(\d[\d\s]*)/i,
  /j'ai vendu\s+(.+?)\s+à\s+(\d[\d\s]*)/i,
];

// Mots qui indiquent une dépense
const EXPENSE_PATTERNS = [
  /j'ai dépensé\s+(\d[\d\s]*)\s+(?:pour\s+)?(.+)/i,
  /dépensé\s+(\d[\d\s]*)\s+(?:pour\s+)?(.+)/i,
  /dépense\s+(?:de\s+)?(\d[\d\s]*)\s+(?:pour\s+)?(.+)/i,
  /payé\s+(\d[\d\s]*)\s+(?:pour\s+)?(.+)/i,
  /achat\s+(?:de\s+)?(.+?)\s+(\d[\d\s]*)/i,
];

// Mots qui indiquent une dette
const DEBT_PATTERNS = [
  /(.+?)\s+me doit\s+(\d[\d\s]*)/i,
  /(.+?)\s+doit\s+(\d[\d\s]*)/i,
  /dette\s+(?:de\s+)?(.+?)\s+(\d[\d\s]*)/i,
  /crédit\s+(?:de\s+)?(.+?)\s+(\d[\d\s]*)/i,
];

/**
 * Nettoie un nombre formaté (enlève les espaces)
 */
function parseAmount(str: string): number {
  return parseInt(str.replace(/\s/g, ''), 10) || 0;
}

/**
 * Détermine la catégorie de dépense à partir du texte
 */
function guessExpenseCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('transport') || lower.includes('taxi') || lower.includes('moto')) return 'Transport';
  if (lower.includes('loyer') || lower.includes('boutique')) return 'Loyer';
  if (lower.includes('électricité') || lower.includes('courant')) return 'Électricité';
  if (lower.includes('eau')) return 'Eau';
  if (lower.includes('internet') || lower.includes('wifi')) return 'Internet';
  if (lower.includes('téléphone') || lower.includes('recharge') || lower.includes('forfait')) return 'Communication';
  if (lower.includes('salaire') || lower.includes('employé')) return 'Salaire';
  if (lower.includes('nourriture') || lower.includes('repas') || lower.includes('manger')) return 'Nourriture';
  if (lower.includes('marchandise') || lower.includes('achat') || lower.includes('stock')) return 'Achat marchandises';
  return 'Autre';
}

/**
 * Parse une expression naturelle en opération structurée
 */
export function parseNaturalLanguage(text: string): ParsedOperation {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // ── Tentative de détection de VENTE ──
  for (const pattern of SALE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      // Pattern: "j'ai vendu 3 pantalons à 7500"
      if (match.length >= 4) {
        const qty = parseInt(match[1], 10);
        const productName = match[2].trim();
        const unitPrice = parseAmount(match[3]);
        const total = qty * unitPrice;

        return {
          type: 'sale',
          confidence: 0.9,
          rawText: trimmed,
          displayText: `${qty} ${productName} × ${unitPrice.toLocaleString('fr-FR')} FCFA`,
          data: {
            product_name: productName,
            quantity: qty,
            unit_price: unitPrice,
            total_amount: total,
            payment_method: 'cash',
            sold_at: new Date().toISOString(),
          },
        };
      }
      // Pattern: "j'ai vendu des chaussures à 15000"
      if (match.length >= 3) {
        const productName = match[1].trim();
        const unitPrice = parseAmount(match[2]);
        return {
          type: 'sale',
          confidence: 0.8,
          rawText: trimmed,
          displayText: `1 ${productName} × ${unitPrice.toLocaleString('fr-FR')} FCFA`,
          data: {
            product_name: productName,
            quantity: 1,
            unit_price: unitPrice,
            total_amount: unitPrice,
            payment_method: 'cash',
            sold_at: new Date().toISOString(),
          },
        };
      }
    }
  }

  // Détection simple "vente" sans pattern précis
  if (lower.includes('vend') || lower.includes('vendu') || lower.includes('vente')) {
    // Chercher un montant dans le texte
    const amountMatch = trimmed.match(/(\d[\d\s]*)/);
    if (amountMatch) {
      const amount = parseAmount(amountMatch[1]);
      return {
        type: 'sale',
        confidence: 0.6,
        rawText: trimmed,
        displayText: `Vente de ${amount.toLocaleString('fr-FR')} FCFA`,
        data: {
          product_name: 'Produit',
          quantity: 1,
          unit_price: amount,
          total_amount: amount,
          payment_method: 'cash',
          sold_at: new Date().toISOString(),
        },
      };
    }
  }

  // ── Tentative de détection de DÉPENSE ──
  for (const pattern of EXPENSE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const amount = parseAmount(match[1]);
      const description = (match[2] || '').trim();
      const category = guessExpenseCategory(description || trimmed);

      return {
        type: 'expense',
        confidence: 0.9,
        rawText: trimmed,
        displayText: `${category} — ${amount.toLocaleString('fr-FR')} FCFA`,
        data: {
          amount,
          category_name: category,
          description,
          payment_method: 'cash',
          spent_at: new Date().toISOString(),
        },
      };
    }
  }

  // Détection simple dépense par mots-clés
  const hasExpenseKeyword = EXPENSE_KEYWORDS.some(k => lower.includes(k));
  if (hasExpenseKeyword || lower.includes('dépen') || lower.includes('payé') || lower.includes('acheté')) {
    const amountMatch = trimmed.match(/(\d[\d\s]+)/);
    if (amountMatch) {
      const amount = parseAmount(amountMatch[1]);
      const category = guessExpenseCategory(trimmed);
      return {
        type: 'expense',
        confidence: 0.7,
        rawText: trimmed,
        displayText: `${category} — ${amount.toLocaleString('fr-FR')} FCFA`,
        data: {
          amount,
          category_name: category,
          description: trimmed,
          payment_method: 'cash',
          spent_at: new Date().toISOString(),
        },
      };
    }
  }

  // ── Tentative de détection de DETTE ──
  for (const pattern of DEBT_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const customerName = match[1].trim();
      const amount = parseAmount(match[2]);

      return {
        type: 'debt',
        confidence: 0.9,
        rawText: trimmed,
        displayText: `${customerName} doit ${amount.toLocaleString('fr-FR')} FCFA`,
        data: {
          customer_name: customerName,
          initial_amount: amount,
        },
      };
    }
  }

  if (lower.includes('doit') || lower.includes('dette') || lower.includes('crédit')) {
    const amountMatch = trimmed.match(/(\d[\d\s]+)/);
    const nameMatch = trimmed.match(/^([A-ZÀ-Ÿa-zà-ÿ\s]+?)\s+(?:me\s+)?doit/i);
    if (amountMatch) {
      return {
        type: 'debt',
        confidence: 0.7,
        rawText: trimmed,
        displayText: `Dette de ${parseAmount(amountMatch[1]).toLocaleString('fr-FR')} FCFA`,
        data: {
          customer_name: nameMatch ? nameMatch[1].trim() : 'Client',
          initial_amount: parseAmount(amountMatch[1]),
        },
      };
    }
  }

  // ── Impossible de détecter ──
  return {
    type: 'unknown',
    confidence: 0,
    rawText: trimmed,
    displayText: trimmed,
    data: {},
  };
}

/**
 * Génère le message de confirmation pour l'utilisateur
 */
export function getConfirmationMessage(parsed: ParsedOperation): string {
  switch (parsed.type) {
    case 'sale': {
      const d = parsed.data as { quantity?: number; product_name?: string; unit_price?: number; total_amount?: number };
      const total = (d.quantity || 1) * (d.unit_price || 0);
      return [
        '🛒 **Vente**',
        `Produit : ${d.product_name}`,
        `Qté : ${d.quantity}`,
        `Prix unitaire : ${(d.unit_price || 0).toLocaleString('fr-FR')} FCFA`,
        `**Total : ${total.toLocaleString('fr-FR')} FCFA**`,
      ].join('\n');
    }
    case 'expense': {
      const d = parsed.data as { category_name?: string; amount?: number; description?: string };
      return [
        '💸 **Dépense**',
        `Catégorie : ${d.category_name}`,
        `Montant : **${(d.amount || 0).toLocaleString('fr-FR')} FCFA**`,
        d.description ? `Description : ${d.description}` : '',
      ].filter(Boolean).join('\n');
    }
    case 'debt': {
      const d = parsed.data as { customer_name?: string; initial_amount?: number };
      return [
        '📋 **Dette client**',
        `Client : ${d.customer_name}`,
        `Montant : **${(d.initial_amount || 0).toLocaleString('fr-FR')} FCFA**`,
      ].join('\n');
    }
    default:
      return "Je n'ai pas compris cette opération. Essayez d'être plus précis.";
  }
}
