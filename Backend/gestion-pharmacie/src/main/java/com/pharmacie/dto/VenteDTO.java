package com.pharmacie.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class VenteDTO {
    private Long id;
    private LocalDateTime date;
    private Double montantTotal;
    private boolean avecOrdonnance;
    private Long patientId;
    private String patientNom;
    private Long medecinId;
    private String medecinNom;
    private Long utilisateurId;
    private String utilisateurNom;
    private List<LigneVenteDTO> lignes;

    // Constructeurs
    public VenteDTO() {
        this.lignes = new ArrayList<>();
    }

    public VenteDTO(Long patientId, boolean avecOrdonnance) {
        this.patientId = patientId;
        this.avecOrdonnance = avecOrdonnance;
        this.date = LocalDateTime.now();
        this.lignes = new ArrayList<>();
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
    public Long getPatientId() {
        return patientId;
    }
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    public String getPatientNom() {
        return patientNom;
    }
    public void setPatientNom(String patientNom) {
        this.patientNom = patientNom;
    }
    public Long getMedecinId() {
        return medecinId;
    }
    public void setMedecinId(Long medecinId) {
        this.medecinId = medecinId;
    }
    public String getMedecinNom() {
        return medecinNom;
    }
    public void setMedecinNom(String medecinNom) {
        this.medecinNom = medecinNom;
    }
    public Long getUtilisateurId() {
        return utilisateurId;
    }
    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }
    public String getUtilisateurNom() {
        return utilisateurNom;
    }
    public void setUtilisateurNom(String utilisateurNom) {
        this.utilisateurNom = utilisateurNom;
    }
    public List<LigneVenteDTO> getLignes() {
        return lignes;
    }
    public void setLignes(List<LigneVenteDTO> lignes) {
        this.lignes = lignes;
    }
}