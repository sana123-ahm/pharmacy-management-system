package com.pharmacie.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String contact;

    @OneToMany(mappedBy = "fournisseur")
    @JsonIgnore
    private List<Medicament> medicaments;

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
    public String getContact() {
        return contact;
    }
    public void setContact(String contact) {
        this.contact = contact;
    }
    public List<Medicament> getMedicaments() {
        return medicaments;
    }
    public void setMedicaments(List<Medicament> medicaments) {
        this.medicaments = medicaments;
    }
}