package com.pharmacie.dto;

public class UpdateMedicamentDTO {
    
    private String nom;
    private Double prix;
    private int stock;
    private boolean ordonnanceRequise;
    private Long fournisseurId;

    // Constructors
    public UpdateMedicamentDTO() {
    }

    public UpdateMedicamentDTO(String nom, Double prix, int stock, 
                               boolean ordonnanceRequise, Long fournisseurId) {
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
        this.ordonnanceRequise = ordonnanceRequise;
        this.fournisseurId = fournisseurId;
    }

    // Getters & Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isOrdonnanceRequise() {
        return ordonnanceRequise;
    }

    public void setOrdonnanceRequise(boolean ordonnanceRequise) {
        this.ordonnanceRequise = ordonnanceRequise;
    }

    public Long getFournisseurId() {
        return fournisseurId;
    }

    public void setFournisseurId(Long fournisseurId) {
        this.fournisseurId = fournisseurId;
    }
}
