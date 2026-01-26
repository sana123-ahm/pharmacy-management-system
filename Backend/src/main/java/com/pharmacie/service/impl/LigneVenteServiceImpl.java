package com.pharmacie.service.impl;

import com.pharmacie.dto.LigneVenteDTO;
import com.pharmacie.model.LigneVente;
import com.pharmacie.model.Medicament;
import com.pharmacie.model.Vente;
import com.pharmacie.repository.LigneVenteRepository;
import com.pharmacie.repository.MedicamentRepository;
import com.pharmacie.repository.VenteRepository;
import com.pharmacie.service.LigneVenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LigneVenteServiceImpl implements LigneVenteService {

    @Autowired
    private LigneVenteRepository ligneVenteRepository;

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Override
    public LigneVenteDTO creerLigneVente(LigneVenteDTO ligneVenteDTO) {
        LigneVente ligne = new LigneVente();

        Vente vente = venteRepository.findById(ligneVenteDTO.getId())
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));

        Medicament medicament = medicamentRepository.findById(ligneVenteDTO.getMedicamentId())
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

        ligne.setVente(vente);
        ligne.setMedicament(medicament);
        ligne.setQuantite(ligneVenteDTO.getQuantite());
        ligne.setPrixUnitaire(ligneVenteDTO.getPrixUnitaire());

        LigneVente ligneSauvegardee = ligneVenteRepository.save(ligne);
        return convertToDTO(ligneSauvegardee);
    }

    @Override
    public LigneVenteDTO obtenirLigneVenteById(Long id) {
        LigneVente ligne = ligneVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de vente non trouvée"));
        return convertToDTO(ligne);
    }

    @Override
    public List<LigneVenteDTO> obtenirLignesParVente(Long venteId) {
        return ligneVenteRepository.findByVente_Id(venteId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LigneVenteDTO> obtenirLignesParMedicament(Long medicamentId) {
        return ligneVenteRepository.findByMedicament_Id(medicamentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LigneVenteDTO modifierLigneVente(Long id, LigneVenteDTO ligneVenteDTO) {
        LigneVente ligne = ligneVenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de vente non trouvée"));

        Medicament medicament = medicamentRepository.findById(ligneVenteDTO.getMedicamentId())
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

        ligne.setMedicament(medicament);
        ligne.setQuantite(ligneVenteDTO.getQuantite());
        ligne.setPrixUnitaire(ligneVenteDTO.getPrixUnitaire());

        LigneVente ligneMaj = ligneVenteRepository.save(ligne);
        return convertToDTO(ligneMaj);
    }

    @Override
    public void supprimerLigneVente(Long id) {
        ligneVenteRepository.deleteById(id);
    }

    @Override
    public void supprimerLignesVente(Long venteId) {
        List<LigneVente> lignes = ligneVenteRepository.findByVente_Id(venteId);
        ligneVenteRepository.deleteAll(lignes);
    }

    private LigneVenteDTO convertToDTO(LigneVente ligne) {
        LigneVenteDTO dto = new LigneVenteDTO();
        dto.setId(ligne.getId());
        dto.setMedicamentId(ligne.getMedicament().getId());
        dto.setMedicamentNom(ligne.getMedicament().getNom());
        dto.setQuantite(ligne.getQuantite());
        dto.setPrixUnitaire(ligne.getPrixUnitaire());
        dto.setTotal(ligne.getTotal());
        return dto;
    }
}