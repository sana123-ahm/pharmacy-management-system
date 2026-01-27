package com.pharmacie.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.dto.VenteDTO;
import com.pharmacie.service.VenteService;

@RestController
@RequestMapping("/api/ventes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class VenteController {

    @Autowired
    private VenteService venteService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllVentes() {
        try {
            List<VenteDTO> ventes = venteService.getAllVentes();
            return ResponseEntity.ok(ventes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors du chargement des ventes: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenteById(@PathVariable Long id) {
        try {
            return venteService.getVenteById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors du chargement de la vente: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getVentesByPatient(@PathVariable Long patientId) {
        try {
            List<VenteDTO> ventes = venteService.getVentesByPatient(patientId);
            return ResponseEntity.ok(ventes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors du chargement des ventes: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<?> getVentesByUtilisateur(@PathVariable Long utilisateurId) {
        try {
            List<VenteDTO> ventes = venteService.getVentesByUtilisateur(utilisateurId);
            return ResponseEntity.ok(ventes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors du chargement des ventes: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getVentesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<VenteDTO> ventes = venteService.getVentesByDateRange(startDate, endDate);
            return ResponseEntity.ok(ventes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors du chargement des ventes: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> creerVente(@RequestBody VenteDTO venteDTO) {
        try {
            VenteDTO result = venteService.creerVente(venteDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Erreur lors de la création de la vente: " + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVente(@PathVariable Long id, @RequestBody VenteDTO venteDTO) {
        try {
            VenteDTO result = venteService.updateVente(id, venteDTO);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Erreur lors de la mise à jour: " + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVente(@PathVariable Long id) {
        try {
            venteService.deleteVente(id);
            return ResponseEntity.ok("{\"message\": \"Vente supprimée\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors de la suppression: " + e.getMessage() + "\"}");
        }
    }
}
