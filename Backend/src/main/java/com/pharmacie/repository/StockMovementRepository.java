package com.pharmacie.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pharmacie.model.StockMovement;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    // Récupérer tous les mouvements d'un médicament
    List<StockMovement> findByMedicamentIdOrderByCreatedAtDesc(Long medicamentId);
    
    // Récupérer les mouvements d'une période
    List<StockMovement> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    
    // Récupérer les mouvements d'un médicament sur une période
    List<StockMovement> findByMedicamentIdAndCreatedAtBetweenOrderByCreatedAtDesc(
        Long medicamentId, LocalDateTime start, LocalDateTime end
    );
    
    // Récupérer les mouvements par type
    List<StockMovement> findByTypeOrderByCreatedAtDesc(StockMovement.MovementType type);
}
