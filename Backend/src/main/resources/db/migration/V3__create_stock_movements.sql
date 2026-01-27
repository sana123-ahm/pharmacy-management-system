CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    medicament_id BIGINT NOT NULL REFERENCES medicament(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('RECEPTION', 'VENTE', 'AJUSTEMENT')),
    motif VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_medicament FOREIGN KEY (medicament_id) REFERENCES medicament(id) ON DELETE CASCADE
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_stock_movements_medicament_id ON stock_movements(medicament_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_medicament_created ON stock_movements(medicament_id, created_at);
