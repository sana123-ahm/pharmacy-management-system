package com.pharmacie.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.pharmacie.dto.LigneVenteDTO;
import com.pharmacie.service.LigneVenteService;

@RestController
@RequestMapping("/api/lignes-vente")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class LigneVenteController {

    @Autowired
    private LigneVenteService ligneVenteService;

    @PostMapping("/create")
    public ResponseEntity<LigneVenteDTO> creerLigneVente(@RequestBody LigneVenteDTO ligneVenteDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ligneVenteService.creerLigneVente(ligneVenteDTO));
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<LigneVenteDTO> obtenirLigneVente(@PathVariable Long id) {
        return ResponseEntity.ok(ligneVenteService.obtenirLigneVenteById(id));
    }

    @GetMapping("/all-by-vente/{venteId}")
    public ResponseEntity<List<LigneVenteDTO>> obtenirLignesParVente(@PathVariable Long venteId) {
        return ResponseEntity.ok(ligneVenteService.obtenirLignesParVente(venteId));
    }

    @GetMapping("/all-by-medicament/{medicamentId}")
    public ResponseEntity<List<LigneVenteDTO>> obtenirLignesParMedicament(@PathVariable Long medicamentId) {
        return ResponseEntity.ok(ligneVenteService.obtenirLignesParMedicament(medicamentId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LigneVenteDTO> modifierLigneVente(@PathVariable Long id, @RequestBody LigneVenteDTO ligneVenteDTO) {
        return ResponseEntity.ok(ligneVenteService.modifierLigneVente(id, ligneVenteDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> supprimerLigneVente(@PathVariable Long id) {
        ligneVenteService.supprimerLigneVente(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/vente/{venteId}")
    public ResponseEntity<Void> supprimerLignesVente(@PathVariable Long venteId) {
        ligneVenteService.supprimerLignesVente(venteId);
        return ResponseEntity.noContent().build();
    }
}