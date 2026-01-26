package com.pharmacie.repository;
import com.pharmacie.model.Vente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
public interface VenteRepository extends JpaRepository<Vente, Long> {
    List<Vente> findByPatient_Id(Long patientId);
    List<Vente> findByUtilisateur_Id(Long utilisateurId);
    List<Vente> findByAvecOrdonnance(boolean avecOrdonnance);
    @Query("SELECT v FROM Vente v WHERE v.date BETWEEN :debut AND :fin")
    List<Vente> findByDateRange(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
}
