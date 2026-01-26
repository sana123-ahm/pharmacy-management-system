package com.pharmacie.dto;

public class MedicamentStockUpdateDTO {
    
    private Long medicamentId;
    private int quantiteVendue;

    // Constructors
    public MedicamentStockUpdateDTO() {
    }

    public MedicamentStockUpdateDTO(Long medicamentId, int quantiteVendue) {
        this.medicamentId = medicamentId;
        this.quantiteVendue = quantiteVendue;
    }

    // Getters & Setters
    public Long getMedicamentId() {
        return medicamentId;
    }

    public void setMedicamentId(Long medicamentId) {
        this.medicamentId = medicamentId;
    }

    public int getQuantiteVendue() {
        return quantiteVendue;
    }

    public void setQuantiteVendue(int quantiteVendue) {
        this.quantiteVendue = quantiteVendue;
    }
}
