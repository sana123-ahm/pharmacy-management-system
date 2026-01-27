package com.pharmacie.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ventes")
public class Vente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Double montantTotal;

    @Column(nullable = false)
    private boolean avecOrdonnance;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id", nullable = true)
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = true)
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<LigneVente> lignes;

    // Constructeurs
    public Vente() {
        this.date = LocalDateTime.now();
        this.lignes = new java.util.ArrayList<>();
    }

    // getters & setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public Double getMontantTotal() {
        return montantTotal;
    }
    public void setMontantTotal(Double montantTotal) {
        this.montantTotal = montantTotal;
    }
    public boolean isAvecOrdonnance() {
        return avecOrdonnance;
    }
    public void setAvecOrdonnance(boolean avecOrdonnance) {
        this.avecOrdonnance = avecOrdonnance;
    }
    public Patient getPatient() {
        return patient;
    }
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    public Medecin getMedecin() {
        return medecin;
    }
    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }
    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
    public List<LigneVente> getLignes() {
        return lignes;
    }
    public void setLignes(List<LigneVente> lignes) {
        this.lignes = lignes;
    }
}