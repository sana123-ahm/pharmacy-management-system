package com.pharmacie.service;

import com.pharmacie.model.Medecin;
import com.pharmacie.repository.MedecinRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MedecinService {

    private final MedecinRepository medecinRepository;

    public MedecinService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    // Créer un médecin (seul le nom est obligatoire)
    public Medecin create(Medecin medecin) {
        if (medecin == null || medecin.getNom() == null || medecin.getNom().trim().isEmpty()) {
            return null;
        }
        return medecinRepository.save(medecin);
    }

    // Récupérer tous les médecins
    public List<Medecin> findAll() {
        return medecinRepository.findAll();
    }

    // Récupérer par ID
    public Optional<Medecin> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return medecinRepository.findById(id);
    }

    // Chercher par nom
    public Medecin findByNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return null;
        }
        return medecinRepository.findByNom(nom.trim());
    }

    // Chercher par contact
    public Medecin findByContact(String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return null;
        }
        return medecinRepository.findByContact(contact.trim());
    }

    // Mettre à jour un médecin (seul le nom est obligatoire)
    public Medecin update(Long id, Medecin medecin) {
        if (id == null) {
            return null;
        }
        // Le nom est obligatoire
        if (medecin.getNom() == null || medecin.getNom().trim().isEmpty()) {
            return null;
        }
        Optional<Medecin> existant = medecinRepository.findById(id);
        if (existant.isPresent()) {
            Medecin m = existant.get();
            m.setNom(medecin.getNom()); // Obligatoire
            if (medecin.getSpecialite() != null && !medecin.getSpecialite().trim().isEmpty()) {
                m.setSpecialite(medecin.getSpecialite());
            }
            if (medecin.getContact() != null && !medecin.getContact().trim().isEmpty()) {
                m.setContact(medecin.getContact());
            }
            return medecinRepository.save(m);
        }
        return null;
    }

    // Supprimer un médecin
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        if (medecinRepository.existsById(id)) {
            medecinRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
