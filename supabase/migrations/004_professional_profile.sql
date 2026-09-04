-- ============================================================
-- FADIMA — Migration : Profil Professionnel
-- Ajout des champs pour le profil public et la description
-- ============================================================

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS opening_hours TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Si on veut un jour créer des index pour la recherche / l'annuaire (Discover)
-- CREATE INDEX IF NOT EXISTS idx_businesses_is_public ON businesses(is_public);
-- CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
-- CREATE INDEX IF NOT EXISTS idx_businesses_activity ON businesses(activity);
