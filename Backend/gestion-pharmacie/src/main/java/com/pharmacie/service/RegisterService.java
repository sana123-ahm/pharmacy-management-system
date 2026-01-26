package com.pharmacie.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pharmacie.model.Utilisateur;
import com.pharmacie.repository.UtilisateurRepository;

@Service
public class RegisterService {
    private final UtilisateurRepository UR;
    private final PasswordEncoder PE;

    public RegisterService(UtilisateurRepository UR
                        , PasswordEncoder PE) {
        this.UR = UR;
        this.PE = PE;   
    }
    public Utilisateur register(String login, String password) {
        // Hashage du mot de passe avant de sauvegarder l'utilisateur
        Utilisateur user = new Utilisateur();
        user.setLogin(login);
        user.setMotDePasse(password);

        if (UR.findByLogin(user.getLogin()) != null) {

            throw new RuntimeException("Login already exists");
        }
    
        String hashedPassword = PE.encode(user.getMotDePasse());
        user.setMotDePasse(hashedPassword);
        return UR.save(user);
    }
}