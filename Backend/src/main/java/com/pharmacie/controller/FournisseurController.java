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

import com.pharmacie.model.Fournisseur;
import com.pharmacie.service.FournisseurService;

@RestController
@RequestMapping("/api/fournisseurs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FournisseurController {

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    // Créer un fournisseur (seul un utilisateur authentifié peut le faire)
    @PostMapping("/create")
    public ResponseEntity<?> createFournisseur(@RequestBody Fournisseur fournisseur) {
        try {
            // Validation: le nom est obligatoire
            if (fournisseur == null || fournisseur.getNom() == null || fournisseur.getNom().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Le nom du fournisseur est obligatoire\"}");
            }
            
            // Ne pas traiter les medicaments lors de la création
            fournisseur.setMedicaments(null);
            
            Fournisseur created = fournisseurService.create(fournisseur);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Récupérer tous les fournisseurs
    @GetMapping("/all")
    public ResponseEntity<List<Fournisseur>> getAllFournisseurs() {
        List<Fournisseur> fournisseurs = fournisseurService.findAll();
        return ResponseEntity.ok(fournisseurs);
    }

    // Récupérer un fournisseur par ID
    @GetMapping("/by-id/{id}")
    public ResponseEntity<Fournisseur> getFournisseurById(@PathVariable Long id) {
        Optional<Fournisseur> fournisseur = fournisseurService.findById(id);
        return fournisseur.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Chercher un fournisseur par nom
    @GetMapping("/by-name/{nom}")
    public ResponseEntity<Fournisseur> getFournisseurByNom(@PathVariable String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Fournisseur fournisseur = fournisseurService.findByNom(nom.trim());
        if (fournisseur != null) {
            return ResponseEntity.ok(fournisseur);
        }
        return ResponseEntity.notFound().build();
    }

    // Chercher un fournisseur par contact
    @GetMapping("/by-contact/{contact}")
    public ResponseEntity<Fournisseur> getFournisseurByContact(@PathVariable String contact) {
        if (contact == null || contact.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Fournisseur fournisseur = fournisseurService.findByContact(contact.trim());
        if (fournisseur != null) {
            return ResponseEntity.ok(fournisseur);
        }
        return ResponseEntity.notFound().build();
    }

    // Mettre à jour un fournisseur
    @PutMapping("/update/{id}")
    public ResponseEntity<Fournisseur> updateFournisseur(@PathVariable Long id, @RequestBody Fournisseur fournisseur) {
        try {
            Fournisseur updated = fournisseurService.update(id, fournisseur);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Supprimer un fournisseur
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFournisseur(@PathVariable Long id) {
        boolean deleted = fournisseurService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Fournisseur supprimé avec succès");
        }
        return ResponseEntity.notFound().build();
    }
}
