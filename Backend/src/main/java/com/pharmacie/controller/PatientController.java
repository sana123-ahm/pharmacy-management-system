package com.pharmacie.controller;

import com.pharmacie.model.Patient;
import com.pharmacie.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Créer un patient (seul un utilisateur authentifié peut le faire)
    @PostMapping("/create")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        try {
            // Validation: le nom est obligatoire
            if (patient == null || patient.getNom() == null || patient.getNom().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Le nom du patient est obligatoire\"}");
            }
            
            Patient created = patientService.create(patient);
            if (created == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Impossible de créer le patient\"}");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Récupérer tous les patients
    @GetMapping("/all")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.findAll();
        return ResponseEntity.ok(patients);
    }

    // Récupérer un patient par ID
    @GetMapping("/by-id/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientService.findById(id);
        return patient.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Chercher un patient par nom
    @GetMapping("/by-name/{nom}")
    public ResponseEntity<Patient> getPatientByNom(@PathVariable String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Patient patient = patientService.findByNom(nom.trim());
        if (patient != null) {
            return ResponseEntity.ok(patient);
        }
        return ResponseEntity.notFound().build();
    }

    // Chercher un patient par contact
    @GetMapping("/by-contact/{contact}")
    public ResponseEntity<Patient> getPatientByContact(@PathVariable String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Patient patient = patientService.findByContact(contact.trim());
        if (patient != null) {
            return ResponseEntity.ok(patient);
        }
        return ResponseEntity.notFound().build();
    }

    // Mettre à jour un patient
    @PutMapping("/update/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        try {
            Patient updated = patientService.update(id, patient);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Supprimer un patient
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        boolean deleted = patientService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Patient supprimé avec succès");
        }
        return ResponseEntity.notFound().build();
    }
}
