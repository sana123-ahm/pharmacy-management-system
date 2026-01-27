package com.pharmacie.dto;

import com.pharmacie.model.Fournisseur;
import com.pharmacie.model.LigneVente;
import java.util.List;

public class MedicamentListDTO {
    
    private Long id;
    private String nom;
    private Double prix;
    private int stock;
    private boolean ordonnanceRequise;
    private Fournisseur fournisseur;
    private List<LigneVente> lignes;
    
    // Constructors
    public MedicamentListDTO() {
    }

    public MedicamentListDTO(Long id, String nom, Double prix, int stock, 
                             boolean ordonnanceRequise, Fournisseur fournisseur, List<LigneVente> lignes) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
        this.ordonnanceRequise = ordonnanceRequise;
        this.fournisseur = fournisseur;
        this.lignes = lignes;
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

    public Fournisseur getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(Fournisseur fournisseur) {
        this.fournisseur = fournisseur;
    }

    public List<LigneVente> getLignes() {
        return lignes;
    }

    public void setLignes(List<LigneVente> lignes) {
        this.lignes = lignes;
    }
}
