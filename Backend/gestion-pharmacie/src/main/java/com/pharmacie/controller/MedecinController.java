package com.pharmacie.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.model.Medecin;
import com.pharmacie.service.MedecinService;

@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class MedecinController {

    private final MedecinService medecinService;

    public MedecinController(MedecinService medecinService) {
        this.medecinService = medecinService;
    }

    // Créer un médecin (seul un utilisateur authentifié peut le faire)
    @PostMapping("/create")
    public ResponseEntity<?> createMedecin(@RequestBody Medecin medecin) {
        try {
            // Validation: le nom est obligatoire
            if (medecin == null || medecin.getNom() == null || medecin.getNom().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Le nom du médecin est obligatoire\"}");
            }
            
            Medecin created = medecinService.create(medecin);
            if (created == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Impossible de créer le médecin\"}");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Récupérer tous les médecins
    @GetMapping("/all")
    public ResponseEntity<List<Medecin>> getAllMedecins() {
        List<Medecin> medecins = medecinService.findAll();
        return ResponseEntity.ok(medecins);
    }

    // Récupérer un médecin par ID
    @GetMapping("/by-id/{id}")
    public ResponseEntity<Medecin> getMedecinById(@PathVariable Long id) {
        Optional<Medecin> medecin = medecinService.findById(id);
        return medecin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Chercher un médecin par nom
    @GetMapping("/by-name/{nom}")
    public ResponseEntity<Medecin> getMedecinByNom(@PathVariable String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Medecin medecin = medecinService.findByNom(nom.trim());
        if (medecin != null) {
            return ResponseEntity.ok(medecin);
        }
        return ResponseEntity.notFound().build();
    }

    // Chercher un médecin par contact
    @GetMapping("/by-contact/{contact}")
    public ResponseEntity<Medecin> getMedecinByContact(@PathVariable String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Medecin medecin = medecinService.findByContact(contact.trim());
        if (medecin != null) {
            return ResponseEntity.ok(medecin);
        }
        return ResponseEntity.notFound().build();
    }

    // Mettre à jour un médecin
    @PutMapping("/update/{id}")
    public ResponseEntity<Medecin> updateMedecin(@PathVariable Long id, @RequestBody Medecin medecin) {
        try {
            Medecin updated = medecinService.update(id, medecin);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Supprimer un médecin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMedecin(@PathVariable Long id) {
        boolean deleted = medecinService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Médecin supprimé avec succès");
        }
        return ResponseEntity.notFound().build();
    }
}
