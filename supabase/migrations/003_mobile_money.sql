-- ============================================================
-- FADIMA — Migration: Intégration Mobile Money
-- Ajout des colonnes pour le suivi des paiements
-- ============================================================

-- Table sales
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_gateway TEXT; -- e.g., 'fedapay'
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_phone TEXT;

-- Table debt_payments (pour plus tard si on paie une dette via Mobile Money)
ALTER TABLE debt_payments ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE debt_payments ADD COLUMN IF NOT EXISTS payment_gateway TEXT;
ALTER TABLE debt_payments ADD COLUMN IF NOT EXISTS payment_phone TEXT;

-- Index pour accélérer la recherche par transaction ID (utile pour les webhooks)
CREATE INDEX IF NOT EXISTS idx_sales_payment_transaction_id ON sales(payment_transaction_id);
CREATE INDEX IF NOT EXISTS idx_debt_payments_payment_transaction_id ON debt_payments(payment_transaction_id);
