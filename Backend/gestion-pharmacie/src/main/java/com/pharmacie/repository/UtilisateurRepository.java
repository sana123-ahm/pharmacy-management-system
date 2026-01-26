package com.pharmacie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacie.model.Utilisateur;
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Utilisateur findByLogin(String login);
    
}
