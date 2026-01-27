package com.pharmacie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pharmacie.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByNom(String nom);
    Patient findByContact(String contact);
}
