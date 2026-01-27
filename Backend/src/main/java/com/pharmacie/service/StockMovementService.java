package com.pharmacie.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacie.dto.StockMovementDTO;
import com.pharmacie.model.Medicament;
import com.pharmacie.model.StockMovement;
import com.pharmacie.repository.MedicamentRepository;
import com.pharmacie.repository.StockMovementRepository;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final MedicamentRepository medicamentRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository, 
                               MedicamentRepository medicamentRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.medicamentRepository = medicamentRepository;
    }

    /**
     * Créer un mouvement de stock (réception, vente, ajustement)
     */
    @Transactional
    public StockMovementDTO createMovement(Long medicamentId, int quantite, 
                                          StockMovement.MovementType type, String motif) {
        Optional<Medicament> medicament = medicamentRepository.findById(medicamentId);
        
        if (!medicament.isPresent()) {
            throw new RuntimeException("Médicament non trouvé avec l'ID: " + medicamentId);
        }

        StockMovement movement = new StockMovement(medicament.get(), quantite, type, motif);
        
        // Mettre à jour le stock du médicament selon le type
        Medicament med = medicament.get();
        switch (type) {
            case RECEPTION:
                // Ajouter le stock reçu
                med.setStock(med.getStock() + quantite);
                break;
            case AJUSTEMENT:
                // Remplacer le stock par la nouvelle valeur (correction)
                med.setStock(quantite);
                break;
            case VENTE:
                if (med.getStock() < quantite) {
                    throw new RuntimeException("Stock insuffisant: " + med.getNom());
                }
                med.setStock(med.getStock() - quantite);
                break;
        }

        medicamentRepository.save(med);
        StockMovement saved = stockMovementRepository.save(movement);
        
        return new StockMovementDTO(saved);
    }

    /**
     * Récupérer tous les mouvements d'un médicament
     */
    public List<StockMovementDTO> getMovementsByMedicament(Long medicamentId) {
        return stockMovementRepository.findByMedicamentIdOrderByCreatedAtDesc(medicamentId)
            .stream()
            .map(StockMovementDTO::new)
            .collect(Collectors.toList());
    }

    /**
     * Récupérer les mouvements d'une période
     */
    public List<StockMovementDTO> getMovementsByPeriod(LocalDateTime start, LocalDateTime end) {
        return stockMovementRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
            .stream()
            .map(StockMovementDTO::new)
            .collect(Collectors.toList());
    }

    /**
     * Récupérer les mouvements d'un médicament sur une période
     */
    public List<StockMovementDTO> getMovementsByMedicamentAndPeriod(Long medicamentId, 
                                                                    LocalDateTime start, 
                                                                    LocalDateTime end) {
        return stockMovementRepository.findByMedicamentIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            medicamentId, start, end
        )
            .stream()
            .map(StockMovementDTO::new)
            .collect(Collectors.toList());
    }

    /**
     * Récupérer tous les mouvements
     */
    public List<StockMovementDTO> getAllMovements() {
        return stockMovementRepository.findAll()
            .stream()
            .map(StockMovementDTO::new)
            .collect(Collectors.toList());
    }

    /**
     * Récupérer un mouvement par ID
     */
    public StockMovementDTO getMovementById(Long id) {
        return stockMovementRepository.findById(id)
            .map(StockMovementDTO::new)
            .orElse(null);
    }

    /**
     * Supprimer un mouvement (seulement les ajustements)
     */
    @Transactional
    public boolean deleteMovement(Long id) {
        Optional<StockMovement> movement = stockMovementRepository.findById(id);
        
        if (!movement.isPresent()) {
            return false;
        }

        StockMovement m = movement.get();
        
        // Seuls les ajustements peuvent être supprimés
        if (m.getType() != StockMovement.MovementType.AJUSTEMENT) {
            throw new RuntimeException("Impossible de supprimer les ventes ou réceptions");
        }

        // Pour un AJUSTEMENT, il n'y a pas vraiment d'inverse
        // On doit simplement supprimer le mouvement (sans modifier le stock)
        // car c'est une correction administrative
        stockMovementRepository.deleteById(id);
        return true;
    }
}
