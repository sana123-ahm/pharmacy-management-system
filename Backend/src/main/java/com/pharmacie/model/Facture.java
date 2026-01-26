package com.pharmacie.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "factures")
public class Facture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "vente_id", nullable = false, unique = true)
    private Vente vente;
    
    @Column(columnDefinition = "BYTEA")
    private byte[] pdfContent;
    
    @Column(nullable = false)
    private LocalDateTime dateGeneration;
    
    @Column
    private String numeroFacture;
    
    @Column
    private Long tailleKo;

    public Facture() {}

    public Facture(Vente vente, byte[] pdfContent, String numeroFacture) {
        this.vente = vente;
        this.pdfContent = pdfContent;
        this.numeroFacture = numeroFacture;
        this.dateGeneration = LocalDateTime.now();
        this.tailleKo = (long) pdfContent.length / 1024;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vente getVente() {
        return vente;
    }

    public void setVente(Vente vente) {
        this.vente = vente;
    }

    public byte[] getPdfContent() {
        return pdfContent;
    }

    public void setPdfContent(byte[] pdfContent) {
        this.pdfContent = pdfContent;
    }

    public LocalDateTime getDateGeneration() {
        return dateGeneration;
    }

    public void setDateGeneration(LocalDateTime dateGeneration) {
        this.dateGeneration = dateGeneration;
    }

    public String getNumeroFacture() {
        return numeroFacture;
    }

    public void setNumeroFacture(String numeroFacture) {
        this.numeroFacture = numeroFacture;
    }

    public Long getTailleKo() {
        return tailleKo;
    }

    public void setTailleKo(Long tailleKo) {
        this.tailleKo = tailleKo;
    }
}
