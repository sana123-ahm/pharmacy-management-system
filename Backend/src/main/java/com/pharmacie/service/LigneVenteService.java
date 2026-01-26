package com.pharmacie.service;

import com.pharmacie.dto.LigneVenteDTO;
import java.util.List;

public interface LigneVenteService {
    LigneVenteDTO creerLigneVente(LigneVenteDTO ligneVenteDTO);
    LigneVenteDTO obtenirLigneVenteById(Long id);
    List<LigneVenteDTO> obtenirLignesParVente(Long venteId);
    List<LigneVenteDTO> obtenirLignesParMedicament(Long medicamentId);
    LigneVenteDTO modifierLigneVente(Long id, LigneVenteDTO ligneVenteDTO);
    void supprimerLigneVente(Long id);
    void supprimerLignesVente(Long venteId);
}