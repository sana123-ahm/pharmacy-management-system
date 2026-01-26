-- Modifier la table ventes pour que patient_id et medecin_id soient nullable
ALTER TABLE ventes 
ALTER COLUMN patient_id DROP NOT NULL;

ALTER TABLE ventes 
ALTER COLUMN medecin_id DROP NOT NULL;
