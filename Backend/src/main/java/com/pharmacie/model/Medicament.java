package com.pharmacie.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Medicament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private Double prix;
    private int stock;
    private boolean ordonnanceRequise;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @OneToMany(mappedBy = "medicament")
    @JsonIgnore
    private List<LigneVente> lignes;

    // getters & setters
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
