package com.pharmacie.controller;

import com.pharmacie.model.Facture;
import com.pharmacie.service.FactureService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @PostMapping("/generate/{venteId}")
    public ResponseEntity<?> generateAndSaveFacture(@PathVariable Long venteId) {
        try {
            Facture facture = factureService.generateAndSaveFacture(venteId);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating facture: " + e.getMessage());
        }
    }

    @GetMapping("/{factureId}/download")
    public ResponseEntity<byte[]> downloadFacture(@PathVariable Long factureId) {
        try {
            Facture facture = factureService.getFactureById(factureId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture_" + facture.getNumeroFacture() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(facture.getPdfContent());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/vente/{venteId}/download")
    public ResponseEntity<byte[]> downloadFactureByVenteId(@PathVariable Long venteId) {
        try {
            Facture facture = factureService.getFactureByVenteId(venteId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture_" + facture.getNumeroFacture() + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(facture.getPdfContent());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{factureId}")
    public ResponseEntity<Facture> getFacture(@PathVariable Long factureId) {
        try {
            Facture facture = factureService.getFactureById(factureId);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}
