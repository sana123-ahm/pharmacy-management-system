package com.pharmacie.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pharmacie.model.Facture;
import com.pharmacie.model.Vente;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByVente(Vente vente);
    Optional<Facture> findByNumeroFacture(String numeroFacture);
}
