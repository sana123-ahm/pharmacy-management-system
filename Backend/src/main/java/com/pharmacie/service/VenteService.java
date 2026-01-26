package com.pharmacie.service;

import java.time.LocalDateTime;
import java.util.List;

import com.pharmacie.dto.VenteDTO;

public interface VenteService {
    
    VenteDTO creerVente(VenteDTO venteDTO);
    VenteDTO obtenirVenteById(Long id);
    List<VenteDTO> obtenirToutesLesVentes();
    List<VenteDTO> obtenirVentesByPatient(Long patientId);
    List<VenteDTO> obtenirVentesByUtilisateur(Long utilisateurId);
    List<VenteDTO> obtenirVentesByDateRange(LocalDateTime debut, LocalDateTime fin);
    List<VenteDTO> obtenirVentesByJour(LocalDateTime jour);
    List<VenteDTO> obtenirVentesBySemaine(int annee, int semaine);
    List<VenteDTO> obtenirVentesByMois(int annee, int mois);
    List<VenteDTO> obtenirVentesByTrimestre(int annee, int trimestre);
    List<VenteDTO> obtenirVentesBySemestre(int annee, int semestre);
    List<VenteDTO> obtenirVentesByAnnee(int annee);
    VenteDTO modifierVente(Long id, VenteDTO venteDTO);
    void supprimerVente(Long id);
    
}
