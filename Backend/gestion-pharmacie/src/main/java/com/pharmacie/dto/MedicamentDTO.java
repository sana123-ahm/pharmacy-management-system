package com.pharmacie.dto;

public class MedicamentDTO {
    
    private Long id;
    private String nom;
    private Double prix;
    private int stock;
    private boolean ordonnanceRequise;
    private Long fournisseurId;
    private String fournisseurNom;

    // Constructors
    public MedicamentDTO() {
    }

    public MedicamentDTO(Long id, String nom, Double prix, int stock, 
                         boolean ordonnanceRequise, Long fournisseurId, String fournisseurNom) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
        this.ordonnanceRequise = ordonnanceRequise;
        this.fournisseurId = fournisseurId;
        this.fournisseurNom = fournisseurNom;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getFournisseurNom() {
        return fournisseurNom;
    }

    public void setFournisseurNom(String fournisseurNom) {
        this.fournisseurNom = fournisseurNom;
    }
}
