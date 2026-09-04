-- ============================================================
-- FADIMA — Migration : Politique d'accès public aux profils
-- Permet à n'importe qui de lire les profils qui ont is_public = true
-- ============================================================

CREATE POLICY "Public profiles are viewable by everyone"
ON businesses FOR SELECT
USING (is_public = true);
