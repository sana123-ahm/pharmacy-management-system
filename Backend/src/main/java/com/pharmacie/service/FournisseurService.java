package com.pharmacie.service;

import com.pharmacie.model.Fournisseur;
import com.pharmacie.repository.FournisseurRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurService(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }

    // Créer un fournisseur (seul le nom est obligatoire)
    public Fournisseur create(Fournisseur fournisseur) {
        if (fournisseur == null || fournisseur.getNom() == null || fournisseur.getNom().trim().isEmpty()) {
            return null;
        }
        return fournisseurRepository.save(fournisseur);
    }

    // Récupérer tous les fournisseurs
    public List<Fournisseur> findAll() {
        return fournisseurRepository.findAll();
    }

    // Récupérer par ID
    public Optional<Fournisseur> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return fournisseurRepository.findById(id);
    }

    // Chercher par nom
    public Fournisseur findByNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return null;
        }
        return fournisseurRepository.findByNom(nom.trim());
    }

    // Chercher par contact
    public Fournisseur findByContact(String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return null;
        }
        return fournisseurRepository.findByContact(contact.trim());
    }

    // Mettre à jour un fournisseur
    public Fournisseur update(Long id, Fournisseur fournisseur) {
        if (id == null) {
            return null;
        }
        Optional<Fournisseur> existant = fournisseurRepository.findById(id);
        if (existant.isPresent()) {
            Fournisseur f = existant.get();
            if (fournisseur.getNom() != null) f.setNom(fournisseur.getNom());
            if (fournisseur.getContact() != null) f.setContact(fournisseur.getContact());
            return fournisseurRepository.save(f);
        }
        return null;
    }

    // Supprimer un fournisseur
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        if (fournisseurRepository.existsById(id)) {
            fournisseurRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
