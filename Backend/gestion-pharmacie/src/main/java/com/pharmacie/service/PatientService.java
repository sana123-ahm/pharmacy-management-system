package com.pharmacie.service;

import com.pharmacie.model.Patient;
import com.pharmacie.repository.PatientRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Créer un patient (seul le nom est obligatoire)
    public Patient create(Patient patient) {
        if (patient == null || patient.getNom() == null || patient.getNom().trim().isEmpty()) {
            return null;
        }
        return patientRepository.save(patient);
    }

    // Récupérer tous les patients
    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    // Récupérer par ID
    public Optional<Patient> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return patientRepository.findById(id);
    }

    // Chercher par nom
    public Patient findByNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return null;
        }
        return patientRepository.findByNom(nom.trim());
    }

    // Chercher par contact
    public Patient findByContact(String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return null;
        }
        return patientRepository.findByContact(contact.trim());
    }

    // Mettre à jour un patient (seul le nom est obligatoire)
    public Patient update(Long id, Patient patient) {
        if (id == null) {
            return null;
        }
        // Le nom est obligatoire
        if (patient.getNom() == null || patient.getNom().trim().isEmpty()) {
            return null;
        }
        Optional<Patient> existant = patientRepository.findById(id);
        if (existant.isPresent()) {
            Patient p = existant.get();
            p.setNom(patient.getNom()); // Obligatoire
            if (patient.getAge() > 0) p.setAge(patient.getAge());
            if (patient.getContact() != null) p.setContact(patient.getContact());
            return patientRepository.save(p);
        }
        return null;
    }

    // Supprimer un patient
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
