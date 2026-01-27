package com.pharmacie.repository;

import com.pharmacie.model.LigneVente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LigneVenteRepository extends JpaRepository<LigneVente, Long> {
    List<LigneVente> findByVente_Id(Long venteId);
    List<LigneVente> findByMedicament_Id(Long medicamentId);
}