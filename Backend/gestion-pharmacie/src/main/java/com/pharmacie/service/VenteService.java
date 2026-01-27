package com.pharmacie.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacie.dto.VenteDTO;
import com.pharmacie.model.Patient;
import com.pharmacie.model.Utilisateur;
import com.pharmacie.model.Vente;
import com.pharmacie.repository.PatientRepository;
import com.pharmacie.repository.UtilisateurRepository;
import com.pharmacie.repository.VenteRepository;

@Service
@Transactional
public class VenteService {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<VenteDTO> getAllVentes() {
        return venteRepository.findAll().stream()
                .map(this::convertToDTOSimple)
                .collect(Collectors.toList());
    }

    public Optional<VenteDTO> getVenteById(Long id) {
        return venteRepository.findById(id)
                .map(this::convertToDTOSimple);
    }

    public List<VenteDTO> getVentesByPatient(Long patientId) {
        return venteRepository.findByPatient_Id(patientId).stream()
                .map(this::convertToDTOSimple)
                .collect(Collectors.toList());
    }

    public List<VenteDTO> getVentesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return venteRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTOSimple)
                .collect(Collectors.toList());
    }

    public List<VenteDTO> getVentesByUtilisateur(Long utilisateurId) {
        return venteRepository.findByUtilisateur_Id(utilisateurId).stream()
                .map(this::convertToDTOSimple)
                .collect(Collectors.toList());
    }

    public VenteDTO creerVente(VenteDTO venteDTO) {
        Vente vente = new Vente();
        vente.setDate(venteDTO.getDate() != null ? venteDTO.getDate() : LocalDateTime.now());
        vente.setMontantTotal(venteDTO.getMontantTotal());
        vente.setAvecOrdonnance(venteDTO.isAvecOrdonnance());

        // Charger le patient si ID fourni
        if (venteDTO.getPatientId() != null) {
            Optional<Patient> patient = patientRepository.findById(venteDTO.getPatientId());
            patient.ifPresent(vente::setPatient);
        }

        // Charger l'utilisateur si ID fourni
        if (venteDTO.getUtilisateurId() != null) {
            Optional<Utilisateur> utilisateur = utilisateurRepository.findById(venteDTO.getUtilisateurId());
            utilisateur.ifPresent(vente::setUtilisateur);
        }

        Vente savedVente = venteRepository.save(vente);
        return convertToDTOSimple(savedVente);
    }

    public VenteDTO updateVente(Long id, VenteDTO venteDTO) {
        Optional<Vente> existingVente = venteRepository.findById(id);
        if (existingVente.isPresent()) {
            Vente vente = existingVente.get();
            vente.setDate(venteDTO.getDate() != null ? venteDTO.getDate() : vente.getDate());
            vente.setMontantTotal(venteDTO.getMontantTotal());
            vente.setAvecOrdonnance(venteDTO.isAvecOrdonnance());

            if (venteDTO.getPatientId() != null) {
                Optional<Patient> patient = patientRepository.findById(venteDTO.getPatientId());
                patient.ifPresent(vente::setPatient);
            }

            if (venteDTO.getUtilisateurId() != null) {
                Optional<Utilisateur> utilisateur = utilisateurRepository.findById(venteDTO.getUtilisateurId());
                utilisateur.ifPresent(vente::setUtilisateur);
            }

            Vente updatedVente = venteRepository.save(vente);
            return convertToDTOSimple(updatedVente);
        }
        throw new RuntimeException("Vente non trouvée");
    }

    public void deleteVente(Long id) {
        venteRepository.deleteById(id);
    }

    private VenteDTO convertToDTOSimple(Vente vente) {
        VenteDTO dto = new VenteDTO();
        dto.setId(vente.getId());
        dto.setDate(vente.getDate());
        dto.setMontantTotal(vente.getMontantTotal());
        dto.setAvecOrdonnance(vente.isAvecOrdonnance());

        if (vente.getPatient() != null) {
            dto.setPatientId(vente.getPatient().getId());
        }

        if (vente.getUtilisateur() != null) {
            dto.setUtilisateurId(vente.getUtilisateur().getId());
        }

        return dto;
    }
}
