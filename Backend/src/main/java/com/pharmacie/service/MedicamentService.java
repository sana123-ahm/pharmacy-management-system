package com.pharmacie.service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.pharmacie.dto.MedicamentListDTO;
import com.pharmacie.dto.MedicamentRequestDTO;
import com.pharmacie.dto.MedicamentResponseDTO;
import com.pharmacie.dto.MedicamentStockUpdateDTO;
import com.pharmacie.model.Fournisseur;
import com.pharmacie.model.Medicament;
import com.pharmacie.repository.MedicamentRepository;

@Service
public class MedicamentService {
    private static final Logger logger = LoggerFactory.getLogger(MedicamentService.class);
    private final MedicamentRepository MR;

    public MedicamentService(MedicamentRepository MR) {
        this.MR = MR;  
    }

    // ===== LISTER =====
    public List<Medicament> findAll() {
        return MR.findAll();
    }

    public List<MedicamentListDTO> findAllList() {
        return MR.findAll().stream()
                .map(m -> new MedicamentListDTO(
                        m.getId(), 
                        m.getNom(), 
                        m.getPrix(), 
                        m.getStock(), 
                        m.isOrdonnanceRequise(), 
                        m.getFournisseur(), 
                        m.getLignes()
                ))
                .collect(Collectors.toList());
    }

    // ===== CHERCHER PAR NOM =====
    public Medicament findByNom(String nom) {
        return MR.findByNom(nom);
    }

    // ===== CHERCHER PAR ID =====
    public Optional<Medicament> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return MR.findById(id);
    }

    public MedicamentResponseDTO findByIdResponse(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Medicament> medicament = MR.findById(id);
        if (medicament.isPresent()) {
            Medicament m = medicament.get();
            String fournisseurNom = m.getFournisseur() != null ? m.getFournisseur().getNom() : null;
            Long fournisseurId = m.getFournisseur() != null ? m.getFournisseur().getId() : null;
            return new MedicamentResponseDTO(m.getId(), m.getNom(), m.getPrix(), m.getStock(), 
                                             m.isOrdonnanceRequise(), fournisseurId, fournisseurNom);
        }
        return null;
    }

    // ===== CRÉER UN MÉDICAMENT =====
    public Medicament create(MedicamentRequestDTO requestDTO, Fournisseur fournisseur) {
        Medicament medicament = new Medicament();
        medicament.setNom(requestDTO.getNom());
        medicament.setPrix(requestDTO.getPrix());
        medicament.setStock(requestDTO.getStock());
        medicament.setOrdonnanceRequise(requestDTO.isOrdonnanceRequise());
        medicament.setFournisseur(fournisseur);
        return MR.save(medicament);
    }

    // ===== METTRE À JOUR UN MÉDICAMENT =====
    public Medicament update(Long id, MedicamentRequestDTO requestDTO, Fournisseur fournisseur) {
        if (id == null) {
            return null;
        }
        Optional<Medicament> medicament = MR.findById(id);
        if (medicament.isPresent()) {
            Medicament m = medicament.get();
            m.setNom(requestDTO.getNom());
            m.setPrix(requestDTO.getPrix());
            m.setStock(requestDTO.getStock());
            m.setOrdonnanceRequise(requestDTO.isOrdonnanceRequise());
            m.setFournisseur(fournisseur);
            return MR.save(m);
        }
        return null;
    }

    // ===== METTRE À JOUR LE STOCK APRÈS VENTE =====
    public MedicamentStockUpdateDTO updateStock(Long medicamentId, int quantiteVendue) {
        if (medicamentId == null) {
            return null;
        }
        Optional<Medicament> medicament = MR.findById(medicamentId);
        if (medicament.isPresent()) {
            Medicament m = medicament.get();
            int nouveauStock = m.getStock() - quantiteVendue;
            m.setStock(nouveauStock);
            MR.save(m);
            return new MedicamentStockUpdateDTO(medicamentId, quantiteVendue);
        }
        return null;
    }

    // ===== SUPPRIMER UN MÉDICAMENT =====
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        try {
            if (MR.existsById(id)) {
                MR.deleteById(id);
                return true;
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du médicament avec l'ID " + id, e);
        }
        return false;
    }
}
