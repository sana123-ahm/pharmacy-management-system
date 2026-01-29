package com.pharmacie.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import com.pharmacie.service.FactureService;
import com.pharmacie.service.VenteService;

@RestController
@RequestMapping("/api/ventes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class VenteController {

    @Autowired
    private VenteService venteService;

    @Autowired
    private FactureService factureService;

    @PostMapping("/create")
    public ResponseEntity<?> creerVente(@RequestBody VenteDTO venteDTO) {
        try {
            VenteDTO result = venteService.creerVente(venteDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur interne: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<VenteDTO> obtenirVente(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.obtenirVenteById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<VenteDTO>> obtenirToutesLesVentes() {
        return ResponseEntity.ok(venteService.obtenirToutesLesVentes());
    }

    @GetMapping("/by-patient/{patientId}")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(venteService.obtenirVentesByPatient(patientId));
    }

    @GetMapping("/by-utilisateur/{utilisateurId}")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(venteService.obtenirVentesByUtilisateur(utilisateurId));
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        System.out.println("🌐 VenteController.obtenirVentesByDateRange - Reçu:");
        System.out.println("  Début: " + debut);
        System.out.println("  Fin: " + fin);
        List<VenteDTO> result = venteService.obtenirVentesByDateRange(debut, fin);
        System.out.println("  Retour: " + result.size() + " ventes");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-jour")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByJour(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime jour) {
        return ResponseEntity.ok(venteService.obtenirVentesByJour(jour));
    }

    @GetMapping("/by-semaine")
    public ResponseEntity<List<VenteDTO>> obtenirVentesBySemaine(
            @RequestParam int annee,
            @RequestParam int semaine) {
        return ResponseEntity.ok(venteService.obtenirVentesBySemaine(annee, semaine));
    }

    @GetMapping("/by-mois")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByMois(
            @RequestParam int annee,
            @RequestParam int mois) {
        return ResponseEntity.ok(venteService.obtenirVentesByMois(annee, mois));
    }

    @GetMapping("/by-trimestre")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByTrimestre(
            @RequestParam int annee,
            @RequestParam int trimestre) {
        return ResponseEntity.ok(venteService.obtenirVentesByTrimestre(annee, trimestre));
    }

    @GetMapping("/by-semestre")
    public ResponseEntity<List<VenteDTO>> obtenirVentesBySemestre(
            @RequestParam int annee,
            @RequestParam int semestre) {
        return ResponseEntity.ok(venteService.obtenirVentesBySemestre(annee, semestre));
    }

    @GetMapping("/by-annee")
    public ResponseEntity<List<VenteDTO>> obtenirVentesByAnnee(
            @RequestParam int annee) {
        return ResponseEntity.ok(venteService.obtenirVentesByAnnee(annee));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<VenteDTO> modifierVente(@PathVariable Long id, @RequestBody VenteDTO venteDTO) {
        return ResponseEntity.ok(venteService.modifierVente(id, venteDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> supprimerVente(@PathVariable Long id) {
        venteService.supprimerVente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/facture/{id}")
    public ResponseEntity<?> telechargerFacture(@PathVariable Long id) {
        try {
            VenteDTO vente = venteService.obtenirVenteById(id);
            byte[] pdfContent = factureService.generateFacturePDF(vente);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "facture_" + id + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erreur lors de la génération de la facture: " + e.getMessage() + "\"}");
        }
    }
}
