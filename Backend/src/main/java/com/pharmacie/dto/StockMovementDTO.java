package com.pharmacie.dto;

import java.time.LocalDateTime;

import com.pharmacie.model.StockMovement;

public class StockMovementDTO {
    private Long id;
    private Long medicamentId;
    private String medicamentNom;
    private int quantite;
    private StockMovement.MovementType type;
    private String motif;
    private LocalDateTime createdAt;

    // Constructors
    public StockMovementDTO() {}

    public StockMovementDTO(StockMovement movement) {
        this.id = movement.getId();
        this.medicamentId = movement.getMedicament().getId();
        this.medicamentNom = movement.getMedicament().getNom();
        this.quantite = movement.getQuantite();
        this.type = movement.getType();
        this.motif = movement.getMotif();
        this.createdAt = movement.getCreatedAt();
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMedicamentId() {
        return medicamentId;
    }

    public void setMedicamentId(Long medicamentId) {
        this.medicamentId = medicamentId;
    }

    public String getMedicamentNom() {
        return medicamentNom;
    }

    public void setMedicamentNom(String medicamentNom) {
        this.medicamentNom = medicamentNom;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }

    public StockMovement.MovementType getType() {
        return type;
    }

    public void setType(StockMovement.MovementType type) {
        this.type = type;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
