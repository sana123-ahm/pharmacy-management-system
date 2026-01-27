package com.pharmacie.dto;

public class LigneVenteDTO {
    private Long id;
    private Long medicamentId;
    private String medicamentNom;
    private int quantite;
    private Double prixUnitaire;
    private Double total;

    // Constructeurs
    public LigneVenteDTO() {}

    public LigneVenteDTO(Long medicamentId, int quantite, Double prixUnitaire) {
        this.medicamentId = medicamentId;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.total = quantite * prixUnitaire;
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

    public Double getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(Double prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
