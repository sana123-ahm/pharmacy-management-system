package com.pharmacie.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import com.pharmacie.model.Vente;

public interface VenteRepository extends JpaRepository<Vente, Long> {
    @Override
    @Query("SELECT DISTINCT v FROM Vente v LEFT JOIN FETCH v.lignes")
    @NonNull
    List<Vente> findAll();
    
    @Override
    @Query("SELECT DISTINCT v FROM Vente v LEFT JOIN FETCH v.lignes WHERE v.id = :id")
    @NonNull
    Optional<Vente> findById(@Param("id") @NonNull Long id);
    
    @Query("SELECT DISTINCT v FROM Vente v LEFT JOIN FETCH v.lignes WHERE v.patient.id = :patientId")
    List<Vente> findByPatient_Id(@Param("patientId") Long patientId);
    
    @Query("SELECT DISTINCT v FROM Vente v LEFT JOIN FETCH v.lignes WHERE v.utilisateur.id = :utilisateurId")
    List<Vente> findByUtilisateur_Id(@Param("utilisateurId") Long utilisateurId);
    
    List<Vente> findByAvecOrdonnance(boolean avecOrdonnance);
    
    @Query("SELECT DISTINCT v FROM Vente v LEFT JOIN FETCH v.lignes WHERE v.date BETWEEN :debut AND :fin")
    List<Vente> findByDateRange(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
}
