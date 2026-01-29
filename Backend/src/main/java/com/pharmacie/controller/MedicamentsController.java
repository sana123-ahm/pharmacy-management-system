package com.pharmacie.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.dto.MedicamentListDTO;
import com.pharmacie.dto.MedicamentRequestDTO;
import com.pharmacie.dto.MedicamentResponseDTO;
import com.pharmacie.dto.MedicamentStockUpdateDTO;
import com.pharmacie.model.Fournisseur;
import com.pharmacie.model.Medicament;
import com.pharmacie.service.MedicamentService;

@RestController                    
@RequestMapping("/api/medicaments")
public class MedicamentsController {

    private final MedicamentService MS;

    public MedicamentsController(MedicamentService MS) {
        this.MS = MS;
    }

    // ===== RÉCUPÉRER TOUS LES MÉDICAMENTS =====
    @GetMapping("/all")
    public ResponseEntity<List<Medicament>> getAllMedicaments() {
        List<Medicament> medicaments = MS.findAll();
        return ResponseEntity.ok(medicaments);
    }

    // ===== RÉCUPÉRER TOUS LES MÉDICAMENTS (FORMAT DTO LÉGER) =====
    @GetMapping("/list-simplified")
    public ResponseEntity<List<MedicamentListDTO>> getAllMedicamentsList() {
        List<MedicamentListDTO> medicaments = MS.findAllList();
        return ResponseEntity.ok(medicaments);
    }

    // ===== RÉCUPÉRER UN MÉDICAMENT PAR ID =====
    @GetMapping("/by-id/{id}")
    public ResponseEntity<MedicamentResponseDTO> getMedicamentById(@PathVariable Long id) {
        MedicamentResponseDTO medicament = MS.findByIdResponse(id);
        if (medicament != null) {
            return ResponseEntity.ok(medicament);
        }
        return ResponseEntity.notFound().build();
    }

    // ===== CHERCHER UN MÉDICAMENT PAR NOM =====
    @GetMapping("/by-name/{nom}")
    public ResponseEntity<Medicament> getMedicamentByNom(@PathVariable String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Medicament medicament = MS.findByNom(nom.trim());
        if (medicament != null) {
            return ResponseEntity.ok(medicament);
        }
        return ResponseEntity.notFound().build();
    }

    // ===== CRÉER UN MÉDICAMENT =====
    @PostMapping("/create")
    public ResponseEntity<Medicament> createMedicament(@RequestBody MedicamentRequestDTO requestDTO) {
        try {
            // Vérifier si le fournisseur existe
            Optional<Fournisseur> fournisseur = Optional.empty();
            if (requestDTO.getFournisseurId() != null) {
                // Vous devrez injecter FournisseurRepository pour cela
                // fournisseur = fournisseurRepository.findById(requestDTO.getFournisseurId());
            }

            Medicament medicament = MS.create(requestDTO, fournisseur.orElse(null));
            return ResponseEntity.status(HttpStatus.CREATED).body(medicament);
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ===== METTRE À JOUR UN MÉDICAMENT =====
    @PutMapping("/update/{id}")
    public ResponseEntity<Medicament> updateMedicament(@PathVariable Long id, 
                                                        @RequestBody MedicamentRequestDTO requestDTO) {
        try {
            Optional<Fournisseur> fournisseur = Optional.empty();
            if (requestDTO.getFournisseurId() != null) {
                // fournisseur = fournisseurRepository.findById(requestDTO.getFournisseurId());
            }

            Medicament medicament = MS.update(id, requestDTO, fournisseur.orElse(null));
            if (medicament != null) {
                return ResponseEntity.ok(medicament);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ===== METTRE À JOUR LE STOCK APRÈS VENTE =====
    @PatchMapping("/update-stock")
    public ResponseEntity<MedicamentStockUpdateDTO> updateStock(@RequestBody MedicamentStockUpdateDTO stockUpdateDTO) {
        try {
            MedicamentStockUpdateDTO result = MS.updateStock(
                    stockUpdateDTO.getMedicamentId(), 
                    stockUpdateDTO.getQuantiteVendue()
            );
            if (result != null) {
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ===== SUPPRIMER UN MÉDICAMENT =====
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMedicament(@PathVariable Long id) {
        boolean deleted = MS.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Médicament supprimé avec succès");
        }
        return ResponseEntity.notFound().build();
    }
}
