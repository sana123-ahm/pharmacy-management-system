package com.pharmacie.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pharmacie.model.Medicament;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    Medicament findByNom(String nom);
    
}
