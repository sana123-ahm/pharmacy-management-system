package com.pharmacie.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.dto.StockMovementDTO;
import com.pharmacie.model.StockMovement;
import com.pharmacie.service.StockMovementService;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    /**
     * Créer un mouvement de stock (réception, vente, ajustement)
     */
    @PostMapping("/create")
    public ResponseEntity<?> createMovement(@RequestBody Map<String, Object> request) {
        try {
            Long medicamentId = ((Number) request.get("medicamentId")).longValue();
            int quantite = ((Number) request.get("quantite")).intValue();
            String typeStr = (String) request.get("type");
            String motif = (String) request.getOrDefault("motif", "");

            StockMovement.MovementType type = StockMovement.MovementType.valueOf(typeStr);

            StockMovementDTO movement = stockMovementService.createMovement(
                medicamentId, quantite, type, motif
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(movement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Récupérer tous les mouvements d'un médicament
     */
    @GetMapping("/medicament/{medicamentId}")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByMedicament(
        @PathVariable Long medicamentId
    ) {
        List<StockMovementDTO> movements = stockMovementService.getMovementsByMedicament(medicamentId);
        return ResponseEntity.ok(movements);
    }

    /**
     * Récupérer les mouvements d'une période
     */
    @GetMapping("/period")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByPeriod(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<StockMovementDTO> movements = stockMovementService.getMovementsByPeriod(start, end);
        return ResponseEntity.ok(movements);
    }

    /**
     * Récupérer les mouvements d'un médicament sur une période
     */
    @GetMapping("/medicament/{medicamentId}/period")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByMedicamentAndPeriod(
        @PathVariable Long medicamentId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<StockMovementDTO> movements = stockMovementService.getMovementsByMedicamentAndPeriod(
            medicamentId, start, end
        );
        return ResponseEntity.ok(movements);
    }

    /**
     * Récupérer tous les mouvements
     */
    @GetMapping("/all")
    public ResponseEntity<List<StockMovementDTO>> getAllMovements() {
        List<StockMovementDTO> movements = stockMovementService.getAllMovements();
        return ResponseEntity.ok(movements);
    }

    /**
     * Récupérer un mouvement par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMovementById(@PathVariable Long id) {
        StockMovementDTO movement = stockMovementService.getMovementById(id);
        if (movement != null) {
            return ResponseEntity.ok(movement);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Supprimer un mouvement (seulement les ajustements)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovement(@PathVariable Long id) {
        try {
            boolean deleted = stockMovementService.deleteMovement(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Mouvement supprimé avec succès"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
