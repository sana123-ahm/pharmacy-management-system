package com.pharmacie.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacie.dto.LigneVenteDTO;
import com.pharmacie.dto.VenteDTO;
import com.pharmacie.model.LigneVente;
import com.pharmacie.model.Medecin;
import com.pharmacie.model.Medicament;
import com.pharmacie.model.Patient;
import com.pharmacie.model.Utilisateur;
import com.pharmacie.model.Vente;
import com.pharmacie.repository.LigneVenteRepository;
import com.pharmacie.repository.MedecinRepository;
import com.pharmacie.repository.MedicamentRepository;
import com.pharmacie.repository.PatientRepository;
import com.pharmacie.repository.UtilisateurRepository;
import com.pharmacie.repository.VenteRepository;
import com.pharmacie.service.FactureService;
import com.pharmacie.service.VenteService;

@Service
@Transactional
public class VenteServiceImpl implements VenteService {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private LigneVenteRepository ligneVenteRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private FactureService factureService;

    @Override
    public VenteDTO creerVente(VenteDTO venteDTO) {
        // Si c'est une vente avec ordonnance, patient et médecin sont OBLIGATOIRES
        if (venteDTO.isAvecOrdonnance()) {
            if (venteDTO.getPatientId() == null || venteDTO.getPatientId() <= 0) {
                throw new RuntimeException("Le patient est obligatoire pour une vente avec ordonnance");
            }
            if (venteDTO.getMedecinId() == null || venteDTO.getMedecinId() <= 0) {
                throw new RuntimeException("Le médecin est obligatoire pour une vente avec ordonnance");
            }
        }

        Vente vente = new Vente();
        vente.setDate(LocalDateTime.now());
        vente.setAvecOrdonnance(venteDTO.isAvecOrdonnance());

        // Association patient (optionnel, sauf si ordonnance)
        if (venteDTO.getPatientId() != null && venteDTO.getPatientId() > 0) {
            Patient patient = patientRepository.findById(venteDTO.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient avec l'ID " + venteDTO.getPatientId() + " non trouvé"));
            vente.setPatient(patient);
        }

        // Association medecin (optionnel, sauf si ordonnance)
        if (venteDTO.getMedecinId() != null && venteDTO.getMedecinId() > 0) {
            Medecin medecin = medecinRepository.findById(venteDTO.getMedecinId())
                    .orElseThrow(() -> new RuntimeException("Médecin avec l'ID " + venteDTO.getMedecinId() + " non trouvé"));
            vente.setMedecin(medecin);
        }

        // Association utilisateur (pharmacien) - optionnel
        if (venteDTO.getUtilisateurId() != null && venteDTO.getUtilisateurId() > 0) {
            Utilisateur utilisateur = utilisateurRepository.findById(venteDTO.getUtilisateurId())
                    .orElse(null);
            vente.setUtilisateur(utilisateur);
        }

        // Créer les lignes de vente
        Double montantTotal = 0.0;
        List<LigneVente> lignes = new java.util.ArrayList<>();

        if (venteDTO.getLignes() != null) {
            for (LigneVenteDTO ligneDTO : venteDTO.getLignes()) {
                LigneVente ligne = new LigneVente();

                Medicament medicament = medicamentRepository.findById(ligneDTO.getMedicamentId())
                        .orElseThrow(() -> new RuntimeException("Médicament avec l'ID " + ligneDTO.getMedicamentId() + " non trouvé"));

                // Vérifier si le stock est suffisant
                if (medicament.getStock() < ligneDTO.getQuantite()) {
                    throw new RuntimeException("Stock insuffisant pour " + medicament.getNom() + 
                            ". Disponible: " + medicament.getStock() + ", Demandé: " + ligneDTO.getQuantite());
                }

                ligne.setMedicament(medicament);
                ligne.setQuantite(ligneDTO.getQuantite());
                ligne.setPrixUnitaire(ligneDTO.getPrixUnitaire());
                ligne.setVente(vente);

                // Décrémenter le stock du médicament
                medicament.setStock(medicament.getStock() - ligneDTO.getQuantite());
                medicamentRepository.save(medicament);

                lignes.add(ligne);
                montantTotal += ligne.getTotal();
            }
        }

        vente.setLignes(lignes);
        vente.setMontantTotal(montantTotal);

        System.out.println("=== AVANT SAUVEGARDE VENTE ===");
        System.out.println("Nombre de lignes: " + lignes.size());
        System.out.println("Montant total: " + montantTotal);
        
        Vente venteSauvegardee = venteRepository.save(vente);
        System.out.println("=== VENTE SAUVEGARDÉE ===");
        System.out.println("Vente ID: " + venteSauvegardee.getId());
        System.out.println("Vente lignes: " + venteSauvegardee.getLignes().size());
        
        // Générer automatiquement la facture après la vente
        // La facture DOIT être générée après la vente pour utiliser son ID
        System.out.println("=== AVANT GÉNÉRATION FACTURE ===");
        try {
            System.out.println("Appel de generateAndSaveFacture avec venteId: " + venteSauvegardee.getId());
            factureService.generateAndSaveFacture(venteSauvegardee.getId());
            System.out.println("=== FACTURE GÉNÉRÉE ET ENREGISTRÉE AVEC SUCCÈS ===");
        } catch (Exception e) {
            System.err.println("=== ERREUR GÉNÉRALE LORS DE LA GÉNÉRATION FACTURE ===");
            System.err.println("Message: " + e.getMessage());
            System.err.println("Classe de l'exception: " + e.getClass().getName());
            e.printStackTrace();
            // Continuer sans lever l'exception
        }
        
        return convertToDTO(venteSauvegardee);
    }

    @Override
    public VenteDTO obtenirVenteById(Long id) {
        Vente vente = venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));
        return convertToDTO(vente);
    }

    @Override
    public List<VenteDTO> obtenirToutesLesVentes() {
        return venteRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VenteDTO> obtenirVentesByPatient(Long patientId) {
        return venteRepository.findByPatient_Id(patientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VenteDTO> obtenirVentesByUtilisateur(Long utilisateurId) {
        return venteRepository.findByUtilisateur_Id(utilisateurId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VenteDTO> obtenirVentesByDateRange(LocalDateTime debut, LocalDateTime fin) {
        return venteRepository.findByDateRange(debut, fin)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VenteDTO> obtenirVentesByJour(LocalDateTime jour) {
        LocalDateTime debut = jour.withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime fin = jour.withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public List<VenteDTO> obtenirVentesBySemaine(int annee, int semaine) {
        java.time.LocalDate firstDayOfWeek = java.time.LocalDate.ofYearDay(annee, 1)
                .with(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear(), semaine)
                .with(java.time.temporal.ChronoField.DAY_OF_WEEK, 1);
        LocalDateTime debut = firstDayOfWeek.atStartOfDay();
        LocalDateTime fin = firstDayOfWeek.plusDays(7).atTime(23, 59, 59);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public List<VenteDTO> obtenirVentesByMois(int annee, int mois) {
        LocalDateTime debut = LocalDateTime.of(annee, mois, 1, 0, 0, 0);
        LocalDateTime fin = debut.withDayOfMonth(debut.getMonth().length(java.time.Year.of(annee).isLeap()))
                .withHour(23).withMinute(59).withSecond(59);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public List<VenteDTO> obtenirVentesByTrimestre(int annee, int trimestre) {
        int moisDebut = (trimestre - 1) * 3 + 1;
        LocalDateTime debut = LocalDateTime.of(annee, moisDebut, 1, 0, 0, 0);
        LocalDateTime fin = debut.plusMonths(3).minusDays(1)
                .withHour(23).withMinute(59).withSecond(59);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public List<VenteDTO> obtenirVentesBySemestre(int annee, int semestre) {
        int moisDebut = (semestre - 1) * 6 + 1;
        LocalDateTime debut = LocalDateTime.of(annee, moisDebut, 1, 0, 0, 0);
        LocalDateTime fin = debut.plusMonths(6).minusDays(1)
                .withHour(23).withMinute(59).withSecond(59);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public List<VenteDTO> obtenirVentesByAnnee(int annee) {
        LocalDateTime debut = LocalDateTime.of(annee, 1, 1, 0, 0, 0);
        LocalDateTime fin = LocalDateTime.of(annee, 12, 31, 23, 59, 59);
        return obtenirVentesByDateRange(debut, fin);
    }

    @Override
    public VenteDTO modifierVente(Long id, VenteDTO venteDTO) {
        Vente vente = venteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));

        vente.setAvecOrdonnance(venteDTO.isAvecOrdonnance());

        if (venteDTO.getMedecinId() != null) {
            Medecin medecin = medecinRepository.findById(venteDTO.getMedecinId()).orElse(null);
            vente.setMedecin(medecin);
        }

        venteRepository.save(vente);
        return convertToDTO(vente);
    }

    @Override
    public void supprimerVente(Long id) {
        venteRepository.deleteById(id);
    }

    private VenteDTO convertToDTO(Vente vente) {
        VenteDTO dto = new VenteDTO();
        dto.setId(vente.getId());
        dto.setDate(vente.getDate());
        dto.setMontantTotal(vente.getMontantTotal());
        dto.setAvecOrdonnance(vente.isAvecOrdonnance());
        
        // Patient (optional)
        if (vente.getPatient() != null) {
            dto.setPatientId(vente.getPatient().getId());
            dto.setPatientNom(vente.getPatient().getNom());
        }
        
        // Medecin (optional)
        if (vente.getMedecin() != null) {
            dto.setMedecinId(vente.getMedecin().getId());
            dto.setMedecinNom(vente.getMedecin().getNom());
        }
        
        // Utilisateur (optional)
        if (vente.getUtilisateur() != null) {
            dto.setUtilisateurId(vente.getUtilisateur().getId());
            dto.setUtilisateurNom(vente.getUtilisateur().getLogin());
        }
        
        List<LigneVenteDTO> lignesDTO = vente.getLignes() != null ? vente.getLignes().stream()
                .map(ligne -> {
                    LigneVenteDTO ligneDTO = new LigneVenteDTO();
                    ligneDTO.setId(ligne.getId());
                    ligneDTO.setMedicamentId(ligne.getMedicament().getId());
                    ligneDTO.setMedicamentNom(ligne.getMedicament().getNom());
                    ligneDTO.setQuantite(ligne.getQuantite());
                    ligneDTO.setPrixUnitaire(ligne.getPrixUnitaire());
                    ligneDTO.setTotal(ligne.getTotal());
                    return ligneDTO;
                })
                .collect(Collectors.toList()) : new java.util.ArrayList<>();
        
        dto.setLignes(lignesDTO);
        return dto;
    }
}